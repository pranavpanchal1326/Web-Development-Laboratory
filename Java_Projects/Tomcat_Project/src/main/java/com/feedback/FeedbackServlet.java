package com.feedback;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

@WebServlet("/SubmitFeedback")
public class FeedbackServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Pattern EMAIL = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html; charset=UTF-8");

        String name = s(req.getParameter("name"));
        String email = s(req.getParameter("email"));
        String ratingStr = s(req.getParameter("rating"));
        String comments = s(req.getParameter("comments"));

        List<String> errors = new ArrayList<>();
        if (name.isEmpty()) errors.add("Name is required and cannot be empty");
        else if (name.trim().length() < 2) errors.add("Name must be at least 2 characters");
        if (email.isEmpty()) errors.add("Email is required and cannot be empty");
        else if (!EMAIL.matcher(email.trim()).matches()) errors.add("Please enter a valid email address");
        int rating = 0;
        try {
            rating = Integer.parseInt(ratingStr);
            if (rating < 1 || rating > 5) errors.add("Rating must be between 1 and 5");
        } catch (Exception e) {
            errors.add("Rating must be a valid number between 1 and 5");
        }
        if (comments.length() > 500) errors.add("Comments cannot exceed 500 characters");

        PrintWriter out = resp.getWriter();
        if (!errors.isEmpty()) {
            renderError(out, errors);
        } else {
            renderSuccess(out, name, email, rating, comments);
        }
    }

    private static String s(String in) {
        return in == null ? "" : in;
    }
    private static String esc(String in) {
        return s(in).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace("\"","&quot;").replace("'","&#39;");
    }
    private static String stars(int n) {
        StringBuilder b = new StringBuilder();
        for (int i=1;i<=5;i++) b.append(i<=n ? "⭐" : "☆");
        return b.toString();
    }
    private static String css() {
        return ":root{--bg1:#667eea;--bg2:#764ba2;--card:#fff;--text:#2c3e50;--muted:#7f8c8d;--border:#e1e8ed;--ok1:#2ecc71;--ok2:#27ae60;--err1:#e74c3c;--err2:#c0392b;--warn:#f39c12}" +
               "*{box-sizing:border-box;margin:0;padding:0}body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:linear-gradient(135deg,var(--bg1),var(--bg2));min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;color:var(--text)}.wrap{width:100%;max-width:720px}.card{background:var(--card);border-radius:18px;padding:32px;box-shadow:0 24px 48px rgba(0,0,0,.14)}.ico{width:84px;height:84px;margin:0 auto 14px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:2rem}.ok{background:linear-gradient(135deg,var(--ok1),var(--ok2))}.err{background:linear-gradient(135deg,var(--err1),var(--err2))}h1{font-size:1.9rem;margin-bottom:.5rem}.sub{color:var(--muted);margin-bottom:1rem;text-align:center}.summary{background:#f8f9fa;border-radius:14px;padding:18px;margin:18px 0}.row{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid #ecf0f1}.row:last-child{border-bottom:none}.lbl{font-weight:700}.val{color:var(--muted);max-width:60%;text-align:right;word-break:break-word}.stars{color:var(--warn)}.btn{display:inline-block;margin-top:12px;background:#95a5a6;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:800}.btn:hover{background:#7f8c8d}@media(max-width:768px){.row{flex-direction:column}.val{text-align:left;max-width:100%}}";
    }

    private static void renderError(PrintWriter out, List<String> errors) {
        out.println("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'/>" +
                "<meta name='viewport' content='width=device-width,initial-scale=1'/>" +
                "<title>Validation Error</title><style>" + css() + "</style></head><body>" +
                "<div class='wrap'><div class='card' style='text-align:center'>" +
                "<div class='ico err'>!</div><h1>Validation Error</h1>" +
                "<p class='sub'>Please correct the following issues</p>" +
                "<div class='summary'><ul style='text-align:left;line-height:1.8;margin:0;padding-left:18px'>");
        for (String e : errors) out.println("<li style='color:#c0392b'>" + esc(e) + "</li>");
        out.println("</ul></div><a class='btn' href='feedback.html'>← Back to Form</a></div></div></body></html>");
    }

    private static void renderSuccess(PrintWriter out, String name, String email, int rating, String comments) {
        String ts = new SimpleDateFormat("EEEE, MMMM dd, yyyy 'at' hh:mm a").format(new Date());
        out.println("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'/>" +
                "<meta name='viewport' content='width=device-width,initial-scale=1'/>" +
                "<title>Thank You</title><style>" + css() + "</style></head><body>" +
                "<div class='wrap'><div class='card' style='text-align:center'>" +
                "<div class='ico ok'>✓</div><h1>Thank You, " + esc(name) + "!</h1>" +
                "<p class='sub'>Your feedback has been successfully submitted.</p>" +
                "<div class='summary'>" +
                row("Name:", esc(name)) +
                row("Email:", esc(email)) +
                row("Rating:", "<span class='stars'>" + stars(rating) + " (" + rating + "/5)</span>") +
                (comments != null && !comments.trim().isEmpty() ? row("Comments:", esc(comments.trim())) : "") +
                row("Submitted:", esc(ts)) +
                "</div><a class='btn' href='feedback.html'>Submit Another Feedback</a></div></div></body></html>");
    }

    private static String row(String label, String value) {
        return "<div class='row'><span class='lbl'>" + label + "</span><span class='val'>" + value + "</span></div>";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.sendRedirect("feedback.html");
    }
}
