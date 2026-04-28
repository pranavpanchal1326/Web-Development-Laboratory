import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.decomposition import PCA

def run_classification_workflow():
    """
    Executes the full machine learning workflow:
    1. Load and prepare data.
    2. Find the optimal K for KNN.
    3. Train the final model with the best K.
    4. Evaluate and print the results.
    5. Visualize the decision boundary using PCA.
    """
    
    # --- 1. Load and Prepare Data ---
    data = load_breast_cancer()
    X = data.data
    y = data.target
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    # Scale features for optimal performance
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # --- 2. Find the Optimal K ---
    best_k, k_accuracies = find_optimal_k(X_train_scaled, y_train, X_test_scaled, y_test, max_k=20)
    plot_k_accuracy(k_accuracies)
    
    # --- 3. Train the Final Model ---
    final_model = KNeighborsClassifier(n_neighbors=best_k)
    final_model.fit(X_train_scaled, y_train)

    # --- 4. Evaluate and Print Results ---
    y_pred = final_model.predict(X_test_scaled)
    
    print(f"--- Final Model Evaluation (Optimal K = {best_k}) ---")
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%\n")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=data.target_names))

    # --- 5. Visualize Results using PCA ---
    visualize_with_pca(X_test_scaled, y_test, final_model, data.target_names)

def find_optimal_k(X_train, y_train, X_test, y_test, max_k=20):
    """Tests KNN for K values from 1 to max_k and returns the best K."""
    k_range = range(1, max_k + 1)
    accuracies = []
    
    for k in k_range:
        knn = KNeighborsClassifier(n_neighbors=k)
        knn.fit(X_train, y_train)
        y_pred = knn.predict(X_test)
        accuracies.append(accuracy_score(y_test, y_pred))
        
    best_k = k_range[np.argmax(accuracies)]
    print(f"Optimal K found: {best_k} with accuracy {max(accuracies)*100:.2f}%")
    return best_k, accuracies

def plot_k_accuracy(k_accuracies):
    """Plots the accuracy for each value of K."""
    plt.figure(figsize=(10, 6))
    plt.plot(range(1, len(k_accuracies) + 1), k_accuracies, marker='o', linestyle='--', color='b')
    plt.title('Elbow Method for Finding Optimal K')
    plt.xlabel('Number of Neighbors (K)')
    plt.ylabel('Accuracy')
    plt.xticks(range(1, len(k_accuracies) + 1))
    plt.grid(True)
    plt.show()

def visualize_with_pca(X_scaled, y_true, model, target_names):
    """Reduces data to 2D using PCA and plots the decision boundary."""
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)

    # Re-train a KNN model on the 2D PCA data for visualization
    model_2d = KNeighborsClassifier(n_neighbors=model.n_neighbors)
    model_2d.fit(X_pca, y_true)

    # Create mesh grid
    x_min, x_max = X_pca[:, 0].min() - 1, X_pca[:, 0].max() + 1
    y_min, y_max = X_pca[:, 1].min() - 1, X_pca[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1), np.arange(y_min, y_max, 0.1))

    # Predict on mesh grid
    Z = model_2d.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    # Plot
    plt.figure(figsize=(10, 6))
    plt.contourf(xx, yy, Z, alpha=0.4, cmap='viridis')
    scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y_true, s=30, edgecolor='k', cmap='viridis')
    plt.title(f'KNN Decision Boundary with PCA (K={model.n_neighbors})')
    plt.xlabel('Principal Component 1')
    plt.ylabel('Principal Component 2')
    plt.legend(handles=scatter.legend_elements()[0], labels=list(target_names))
    plt.show()

# --- Run the entire workflow ---
if __name__ == '__main__':
    run_classification_workflow()