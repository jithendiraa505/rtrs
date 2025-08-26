// Create this file at src/test/java/runner/GoogleSearchTest.java

package runner;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import io.github.bonigarcia.wdm.WebDriverManager;
import utils.LoggerHandler;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

import static org.testng.Assert.assertTrue;

import java.io.File;
import java.io.IOException;

public class GoogleSearchTest {
    ExtentReports extent;
    ExtentTest test;
    private WebDriver driver;

    // This method runs before each test method
    @BeforeMethod
    public void setup() {
        // Use WebDriverManager to automatically handle the driver
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize(); // Maximize the browser window
        driver.get("https://www.google.com");
        LoggerHandler.info("Opened Google website.");
    }

    // This is the actual test method
    @Test
    public void testGoogleSearchForMaven() throws InterruptedException, IOException {

        // Step 1: Find the search box and type "maven"
        WebElement searchBox = driver.findElement(By.name("q"));
        String searchTerm = "maven";
        searchBox.sendKeys(searchTerm);
        

        // Optional: Add a small pause for visual observation
        Thread.sleep(2000);

        // Step 2: Submit the form
        // We use Keys.ENTER to submit the form, which is more reliable than
        // findElement(By.name("btnK")).submit()
        searchBox.sendKeys(Keys.ENTER);
        LoggerHandler.info("Pressed Enter to submit the search.");

        // Optional: Add a small pause to wait for the results page to load
        Thread.sleep(2000);

        // Step 3: Verify the page title to confirm the search was successful
        String pageTitle = driver.getTitle();
        LoggerHandler.debug("The page title is: {}");
        assertTrue(pageTitle.contains(searchTerm),
                "The page title should contain '" + searchTerm + "' after the search.");

        LoggerHandler.info("Test passed: testGoogleSearchForMaven");







        TakesScreenshot screenshot = (TakesScreenshot) driver;
        File source = screenshot.getScreenshotAs(OutputType.FILE);
        FileUtils.copyFile(source, new File("screenshot/spice.png"));




        extent = new ExtentReports();
        ExtentSparkReporter spark = new ExtentSparkReporter("C:\\Users\\jithe\\OneDrive\\Desktop\\ST\\demo\\extentreport\\ER.html");
        extent.attachReporter(spark);

         test = extent.createTest("Login Test", "This is a test to verify login functionality.");

        // Simulate a test step
        test.log(Status.INFO, "Opening the website...");
        // driver.get("http://example.com");

        test.log(Status.INFO, "Entering username and password...");
        // Add your Selenium code here
        // driver.findElement(By.id("username")).sendKeys("test");

        test.log(Status.PASS, "Login test passed successfully.");
    }

    // This method runs after each test method
    @AfterMethod
    public void teardown() {
        if (driver != null) {
            LoggerHandler.info("Closing the browser.");
            driver.quit(); // Close the browser and kill the process
            LoggerHandler.info("Browser closed.");
            extent.flush();
        }
    }
}
