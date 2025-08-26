package utils;

import org.openqa.selenium.support.events.WebDriverListener;
import org.testng.Assert;

public class EventHandler implements WebDriverListener {

    // Static assertion methods
    public static void assertEquals(String actual, String expected) {
        try {
            Assert.assertEquals(actual, expected);
            // Print minimized success message to the console
            System.out.println("Pass: Exp=\"" + expected + "\", Act=\"" + actual + "\"");
        } catch (AssertionError e) {
            // Print minimized failure message to the console
            System.err.println("Fail: Exp=\"" + expected + "\", Act=\"" + actual + "\"");
            throw e;
        }
    }

    public static void assertTrue(boolean condition) {
        try {
            Assert.assertTrue(condition);
            // Print minimized success message to the console
            System.out.println("Pass: Condition is true");
        } catch (AssertionError e) {
            // Print minimized failure message to the console
            System.err.println("Fail: Condition is false");
            throw e;
        }
    }
}