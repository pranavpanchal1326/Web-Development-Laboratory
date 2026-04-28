import tkinter as tk
import random

N = 8   # Board size (8x8)
CELL_SIZE = 70  # size of each square in pixels

# --- Check if it's safe to place a queen ---
def is_safe(board, row, col):
    for i in range(row):
        if board[i] == col or board[i] - i == col - row or board[i] + i == col + row:
            return False
    return True

# --- Backtracking solver ---
def solve(row, board, solutions):
    if row == N:
        solutions.append(board[:])
        return
    for col in range(N):
        if is_safe(board, row, col):
            board[row] = col
            solve(row + 1, board, solutions)

# --- Draw the chessboard with queens ---
def draw_board(solution):
    canvas.delete("all")  # clear previous drawings
    for row in range(N):
        for col in range(N):
            # Alternate square colors like a real chessboard
            color = "#f0d9b5" if (row + col) % 2 == 0 else "#b58863"
            canvas.create_rectangle(
                col * CELL_SIZE, row * CELL_SIZE,
                (col + 1) * CELL_SIZE, (row + 1) * CELL_SIZE,
                fill=color, outline=color
            )
            # Draw queen
            if solution[row] == col:
                canvas.create_text(
                    col * CELL_SIZE + CELL_SIZE // 2,
                    row * CELL_SIZE + CELL_SIZE // 2,
                    text="♛", font=("Arial", 36, "bold"), fill="black"
                )

    # Update label
    status_label.config(
        text=f"Solution {current_solution_index + 1} of {len(solutions)}"
    )

# --- Navigation functions ---
def next_solution():
    global current_solution_index
    current_solution_index = (current_solution_index + 1) % len(solutions)
    draw_board(solutions[current_solution_index])

def prev_solution():
    global current_solution_index
    current_solution_index = (current_solution_index - 1) % len(solutions)
    draw_board(solutions[current_solution_index])

# --- Main GUI setup ---
root = tk.Tk()
root.title("8 Queens Problem - Elegant Viewer")
root.resizable(False, False)

canvas = tk.Canvas(root, width=N * CELL_SIZE, height=N * CELL_SIZE, highlightthickness=0)
canvas.pack(pady=10)

# Solve the problem (find all solutions)
solutions = []
solve(0, [-1] * N, solutions)

# Pick random starting solution
current_solution_index = random.randrange(len(solutions))

# Status label
status_label = tk.Label(root, text="", font=("Arial", 14, "bold"))
status_label.pack(pady=5)

# Navigation buttons
btn_frame = tk.Frame(root)
btn_frame.pack(pady=5)

prev_btn = tk.Button(btn_frame, text="⬅ Previous", command=prev_solution,
                     font=("Arial", 12), width=12, bg="#e6e6e6")
prev_btn.grid(row=0, column=0, padx=10)

next_btn = tk.Button(btn_frame, text="Next ➡", command=next_solution,
                     font=("Arial", 12), width=12, bg="#e6e6e6")
next_btn.grid(row=0, column=1, padx=10)

# Draw first solution
draw_board(solutions[current_solution_index])

root.mainloop()
