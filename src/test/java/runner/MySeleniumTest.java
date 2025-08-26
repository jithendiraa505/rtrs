package runner;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Test;

public class MySeleniumTest {
    ExtentReports extent;
    ExtentTest test;
    WebDriver driver;

    @BeforeSuite
    public void setup() {
        extent = new ExtentReports();
        ExtentSparkReporter spark = new ExtentSparkReporter("C:\\Users\\jithe\\OneDrive\\Desktop\\ST\\demo\\extentreport\\ExtentReport.html");
        extent.attachReporter(spark);

        // Setup WebDriver
        // System.setProperty("webdriver.chrome.driver", "path/to/chromedriver");
        // driver = new ChromeDriver();
    }

    @Test
    public void loginTest() throws IOException {
        test = extent.createTest("Login Test", "This is a test to verify login functionality.");

        // Simulate a test step
        test.log(Status.INFO, "Opening the website...");
        // driver.get("http://example.com");
        test.log(Status.INFO, "open");
        test.log(Status.INFO, "Entering username and password...");
        // Add your Selenium code here
        // driver.findElement(By.id("username")).sendKeys("test");

        test.log(Status.PASS, "Login test passed successfully.");


        TakesScreenshot screenshot = (TakesScreenshot) driver;
        File source = screenshot.getScreenshotAs(OutputType.FILE);
        FileUtils.copyFile(source, new File("screenshot/h.png"));
    }

    @AfterSuite
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
        extent.flush(); // This is essential to generate the report.
    }
}