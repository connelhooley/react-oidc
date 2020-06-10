using System;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium.Support.UI;
using Polly;

namespace Tests
{
    public sealed class Driver : IDisposable
    {
        private readonly Uri _baseUrl;
        private readonly TimeSpan _defaultTimeout;
        private readonly IWebDriver _webDriver;

        public Driver()
        {
            _baseUrl = new Uri("https://localhost:5001");
            _defaultTimeout = TimeSpan.FromSeconds(10);
            _webDriver = Policy
                .Handle<WebDriverException>()
                .WaitAndRetry(new[]
                {
                    TimeSpan.FromSeconds(1),
                    TimeSpan.FromSeconds(2),
                    TimeSpan.FromSeconds(6),
                })
                .Execute(() =>
                {
                    bool.TryParse(Environment.GetEnvironmentVariable("STITCHES_ACCEPT_INSECURE_CERTIFICATES"), out var acceptInsecureCertificates);
                    var options = new ChromeOptions
                    {
                        AcceptInsecureCertificates = acceptInsecureCertificates,
                    };
                    options.SetLoggingPreference(LogType.Browser, LogLevel.Info);
                    return new RemoteWebDriver(options);
                });
            _webDriver.Navigate().GoToUrl(_baseUrl);
        }

        public Driver ClickOn(string selector)
        {
            WaitFor(By.CssSelector(selector)).Click();
            return this;
        }

        public Driver EnterText(string selector, string text, bool pressEnterAfterwards = false)
        {
            WaitFor(By.CssSelector(selector)).SendKeys(text + (pressEnterAfterwards ? Keys.Enter : string.Empty));
            return this;
        }

        public Driver Assert(string selector, Action<IWebElement> assertion)
        {
            AssertAndWaitFor(By.CssSelector(selector), assertion);
            return this;
        }

        public Driver GetText(string selector, out string text)
        {
            var element = WaitFor(By.CssSelector(selector));
            text = element.Text.Trim();
            return this;
        }

        public Driver Wait(TimeSpan duration)
        {
            Thread.Sleep(duration);
            return this;
        }

        public void Dispose() => _webDriver.Dispose();

        private IWebElement WaitFor(By by)
        {
            var wait = new WebDriverWait(_webDriver, _defaultTimeout);
            wait.IgnoreExceptionTypes(typeof(Exception));
            var result = wait.Until(driver => driver.FindElement(by));
            return result ?? throw new TimeoutException("Timed out waiting for element");
        }

        private void AssertAndWaitFor(By by, Action<IWebElement> assertion)
        {
            var lastThrownException = default(Exception);
            var wait = new WebDriverWait(_webDriver, _defaultTimeout);
            wait.IgnoreExceptionTypes(typeof(Exception));
            var result = wait.Until(driver =>
            {
                try
                {
                    assertion(driver.FindElement(by));
                    return true;
                }
                catch (Exception ex)
                {
                    lastThrownException = ex;
                    return false;
                }
            });
            if (!result)
            {
                throw lastThrownException ?? new TimeoutException("Timed out waiting for element to assert");
            }
        }
    }
}