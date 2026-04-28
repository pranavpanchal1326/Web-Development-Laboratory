import java.io.IOException;
import java.io.PrintWriter;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
// A simple JSON parsing library could be used here, e.g., org.json or Gson.
// For this example, we'll use basic string manipulation for simplicity.

public class FeedbackServlet extends HttpServlet {

    // IMPORTANT: In a real application, use a secure way to store and access your API key.
    // An empty API key will be automatically handled by the environment.
    private static final String API_KEY = ""; 
    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + API_KEY;

    /**
     * Calls the Gemini API to analyze feedback.
     *
     * @param rating The user's rating.
     * @param comments The user's comments.
     * @return A string array containing the sentiment and the suggested reply, or null on failure.
     */
    private String[] callGeminiApi(String rating, String comments) {
        try {
            // 1. Create the URL and connection object.
            URL url = new URL(API_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // 2. Construct the JSON payload with a specific prompt for structured output.
            String prompt = String.format(
                "Based on the following customer feedback, analyze the sentiment (Positive, Negative, or Neutral) and draft a brief, personalized thank you message. " +
                "Customer Rating: %s/5. Customer Comments: \\\"%s\\\". " +
                "Provide the output in this exact JSON format: { \\\"sentiment\\\": \\\"...\\\", \\\"suggested_reply\\\": \\\"...\\\" }",
                rating, comments.replace("\"", "\\\"") // Escape quotes in comments
            );

            String jsonPayload = String.format(
                "{\"contents\":[{\"parts\":[{\"text\": \"%s\"}]}]}",
                prompt
            );

            // 3. Send the request.
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonPayload.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            // 4. Read the response.
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                StringBuilder response = new StringBuilder();
                try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"))) {
                    String responseLine;
                    while ((responseLine = br.readLine()) != null) {
                        response.append(responseLine.trim());
                    }
                }
                
                // 5. Parse the JSON response to extract the text.
                // This is a simplified parser. A library like Gson or Jackson is recommended for robust parsing.
                String responseBody = response.toString();
                String textContent = responseBody.split("\"text\":\\s*\"")[1].split("\"")[0];
                textContent = textContent.replace("\\\"", "\"").replace("\\n", "\n").trim();

                // Extract sentiment and reply from the model's structured output
                String sentiment = textContent.split("\"sentiment\":\\s*\"")[1].split("\"")[0];
                String reply = textContent.split("\"suggested_reply\":\\s*\"")[1].split("\"")[0];

                return new String[]{sentiment, reply};
            } else {
                // Handle non-200 responses
                System.err.println("Gemini API call failed with response code: " + responseCode);
                return null;
            }

        } catch (Exception e) { // Catch broader exceptions for robustness
            e.printStackTrace();
            return null;
        }
    }


    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            // --- Input Validation ---
            String name = request.getParameter("name");
            String email = request.getParameter("email");
            String ratingStr = request.getParameter("rating");
            String comments = request.getParameter("comments");

            boolean hasError = false;
            StringBuilder errorMessages = new StringBuilder();

            if (name == null || name.trim().isEmpty()) {
                hasError = true;
                errorMessages.append("<li class='list-disc ml-5'>Name is a required field.</li>");
            }
            if (email == null || !email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
                hasError = true;
                errorMessages.append("<li class='list-disc ml-5'>Please enter a valid email address.</li>");
            }
            if (ratingStr == null || ratingStr.trim().isEmpty()) {
                hasError = true;
                errorMessages.append("<li class='list-disc ml-5'>Please select a rating.</li>");
            }
            if (comments == null || comments.trim().isEmpty()) {
                hasError = true;
                errorMessages.append("<li class='list-disc ml-5'>Comments cannot be empty.</li>");
            }

            // --- HTML Response Generation ---
            out.println("<!DOCTYPE html>");
            out.println("<html lang=\"en\">");
            out.println("<head>");
            out.println("<meta charset=\"UTF-8\">");
            out.println("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
            out.println("<title>Feedback Submission</title>");
            out.println("<script src=\"https://cdn.tailwindcss.com\"></script>");
            out.println("<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">");
            out.println("<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\">");
            out.println("<style> body { font-family: 'Inter', sans-serif; } </style>");
            out.println("</head>");
            out.println("<body class=\"bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center min-h-screen p-4\">");
            out.println("<div class=\"bg-white/90 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-3xl text-gray-800\">");

            if (hasError) {
                out.println("<div class='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg' role='alert'>");
                out.println("<p class='font-bold text-lg'>Oops! Something went wrong</p>");
                out.println("<ul>" + errorMessages.toString() + "</ul>");
                out.println("</div>");
                out.println("<a href='index.html' class='inline-block mt-6 text-blue-600 hover:underline font-medium'>&larr; Go back and try again</a>");
            } else {
                // --- Gemini API Integration ---
                String[] geminiResult = callGeminiApi(ratingStr, comments);
                String sentiment = "Analysis unavailable";
                String suggestedReply = "Could not generate a reply at this time.";
                String sentimentColor = "bg-gray-500"; // Default color

                if (geminiResult != null && geminiResult.length == 2) {
                    sentiment = geminiResult[0];
                    suggestedReply = geminiResult[1];
                    if ("Positive".equalsIgnoreCase(sentiment)) {
                        sentimentColor = "bg-green-500";
                    } else if ("Negative".equalsIgnoreCase(sentiment)) {
                        sentimentColor = "bg-red-500";
                    } else if ("Neutral".equalsIgnoreCase(sentiment)) {
                        sentimentColor = "bg-yellow-500";
                    }
                }
                
                // --- Success Message ---
                out.println("<div class='text-center mb-8'>");
                out.println("<h1 class=\"text-3xl font-bold text-green-600\">Thank You, " + name + "!</h1>");
                out.println("<p class=\"mt-2 text-lg text-gray-600\">We've successfully received your feedback.</p>");
                out.println("</div>");
                
                // --- Display Grid ---
                out.println("<div class='grid md:grid-cols-2 gap-8'>");

                // --- Card 1: Original Feedback Summary ---
                out.println("<div class=\"bg-gray-50 p-6 rounded-xl border border-gray-200\">");
                out.println("<h2 class=\"text-xl font-semibold mb-4 flex items-center\"><i class='fas fa-paper-plane mr-3 text-gray-500'></i>Your Submission</h2>");
                out.println("<div class='space-y-3 text-gray-700'>");
                out.println("<p><strong>Name:</strong> " + name + "</p>");
                out.println("<p><strong>Email:</strong> " + email + "</p>");
                out.println("<p><strong>Rating:</strong> " + ratingStr + " out of 5</p>");
                out.println("<p class='pt-2'><strong>Comments:</strong></p>");
                out.println("<blockquote class=\"pl-4 border-l-4 border-gray-300 italic\">" + comments + "</blockquote>");
                out.println("</div></div>");

                // --- Card 2: Gemini API Analysis ---
                out.println("<div class=\"bg-blue-50 p-6 rounded-xl border border-blue-200\">");
                out.println("<h2 class=\"text-xl font-semibold mb-4 flex items-center\"><i class='fas fa-robot mr-3 text-blue-500'></i>AI-Powered Analysis</h2>");
                out.println("<div class='space-y-3 text-gray-700'>");
                out.println("<p><strong>Sentiment:</strong> <span class='text-white text-sm font-medium px-3 py-1 rounded-full " + sentimentColor + "'>" + sentiment + "</span></p>");
                out.println("<p class='pt-2'><strong>Suggested Reply:</strong></p>");
                out.println("<blockquote class=\"pl-4 border-l-4 border-blue-300 italic\">" + suggestedReply + "</blockquote>");
                out.println("</div></div>");
                
                out.println("</div>"); // Close grid
            }

            out.println("</div>"); // Close main container
            out.println("</body>");
            out.println("</html>");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Handles customer feedback form submission and analyzes it using the Gemini API.";
    }
}
