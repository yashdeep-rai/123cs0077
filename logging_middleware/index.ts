export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";
export type Package = 
    | "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" 
    | "repository" | "route" | "service" | "api" | "component" | "hook" 
    | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";

let authToken = "";

/**
 * Set the authentication token to be used for the logging API.
 * @param token The Bearer token obtained from the authentication API.
 */
export const setLogAuthToken = (token: string) => {
    authToken = token;
};

/**
 * Reusable Logging Middleware Function.
 * @param stack The application stack generating the log.
 * @param level The severity level of the log.
 * @param pkg The package or component name generating the log.
 * @param message The descriptive log message.
 */
export const Log = async (stack: Stack, level: Level, pkg: Package, message: string) => {
    try {
        if (!authToken) {
            console.warn("Logging failed: No auth token set. Call setLogAuthToken first.");
            return;
        }

        const payload = {
            stack: stack,
            level: level,
            package: pkg,
            message: message
        };

        const url = typeof window !== 'undefined' 
            ? '/evaluation-service/logs' 
            : 'http://4.224.186.213/evaluation-service/logs';

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`Failed to send log. Status: ${response.status}`, await response.text());
        }
    } catch (error) {
        console.error("Error in Log middleware API call:", error);
    }
};
