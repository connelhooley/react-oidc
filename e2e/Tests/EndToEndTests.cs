using System;
using Xunit;
using FluentAssertions;

namespace Tests
{
    public sealed class EndToEndTests : IDisposable, IClassFixture<Driver>
    {
        private readonly Driver _driver;

        public EndToEndTests(Driver driver) => _driver = driver;

        [Fact]
        public void CanLogIn() => _driver
            // Arrange
            .ClickOn("#sign-in-button")
            .EnterText("#username-input", "bob")
            // Act
            .EnterText("#password-input", "bob", pressEnterAfterwards: true)
            // Assert
            .Assert("#id", element => element.Text.Trim().Should().Be("818727"))
            .Assert("#name", element => element.Text.Trim().Should().Be("Bob Smith"))
            .Assert("#email", element => element.Text.Trim().Should().Be("BobSmith@email.com"))
            .Assert("#role", element => element.Text.Trim().Should().Be("some role"));

        [Fact]
        public void CanLogOut() => _driver
            // Arrange
            .ClickOn("#sign-in-button")
            .EnterText("#username-input", "bob")
            .EnterText("#password-input", "bob", pressEnterAfterwards: true)
            .Assert("#name", element => element.Text.Trim().Should().Be("Bob Smith"))
            // Act
            .ClickOn("#sign-out-button")
            // Assert
            .Assert("#signed-out", element => element.Text.Trim().Should().Be("User is not signed in"));

        [Fact]
        public void CanSilentlyRefresh() => _driver
            // Arrange
            .ClickOn("#sign-in-button")
            .EnterText("#username-input", "bob")
            .EnterText("#password-input", "bob", pressEnterAfterwards: true)
            .Assert("#name", element => element.Text.Trim().Should().Be("Bob Smith"))
            .GetText("#token", out var originalToken)
            // Act
            .Wait(TimeSpan.FromSeconds(30))
            // Assert
            .Assert("#token", element => element.Text.Trim().Should().NotBe(originalToken));

        public void Dispose() => _driver.Dispose();
    }
}
