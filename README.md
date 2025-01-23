# 🖼️ ML-Powered Image Editor  

Welcome to the **ML-Powered Image Editor**! This project is a fully-featured image editing tool built with **React**, **Flask**, and **PyTorch**. It allows users to upload images, apply filters, adjust settings, add text, crop, rotate, and even place text behind objects using a custom **object segmentation model**.  

🚀 **Live Link**: [Link](https://instaedit.vercel.app)
🖥️ **Live Demo**: [Link]([https://instaedit.vercel.app](https://www.linkedin.com/posts/ujjawal-gusain_artificialintelligence-computervision-imageprocessing-activity-7288035239581425665-YJr7)


---

## 🌟 **Features**  
- **Image Upload**: Upload any image for editing.  
- **Filters**: Apply preset filters like Warm, Vivid, Cool, Grayscale, Sepia, and more.  
- **Adjustments**: Fine-tune brightness, contrast, exposure, shadows, highlights, saturation, and other parameters.  
- **Text Overlay**: Add custom text with control over font, size, color, opacity, and rotation.  
- **Crop & Rotate**: Intuitively crop and rotate images for the perfect composition.  
- **ML-Powered Text Behind Objects**: Place text behind objects using a PyTorch-based object segmentation model.  
- **Save & Download**: Export your edited images in high quality.  

---

## 💻 **Tech Stack**  
- **Frontend**:  
  - React  
  - Material-UI (for icons and tooltips)  
  - HTML5 Canvas (for real-time image rendering)  
- **Backend**:  
  - Flask (for image processing and API endpoints)  
  - PyTorch (for object segmentation model)  
- **Deployment**:  
  - Vercel (frontend)  
  - AWS SageMaker (backend and ML model)  

---

## 🛠️ **How It Works**  

### 1. **Frontend (React)**  
- The frontend is built with **React** and uses **HTML5 Canvas** for real-time image rendering.  
- Users can upload images, apply filters, add text, crop, and rotate images.  
- The UI is intuitive and responsive, thanks to **Material-UI** components.  

### 2. **Backend (Flask)**  
- The Flask backend handles image uploads, processing, and communication with the PyTorch model.  
- It generates a **mask array** using the object segmentation model and sends it back to the frontend.  

### 3. **ML Model (PyTorch)**  
- We trained a **U-NET segmentation model** using PyTorch to identify and segment objects in an image.  
- The model generates a mask array that distinguishes between the foreground (objects) and the background.  
- This mask is used to place text behind objects seamlessly.  

---

## 🚀 **Getting Started**  

### Prerequisites  
- Node.js (for frontend)  
- Python 3.8+ (for backend)  
- Flask  
- PyTorch  

### Installation  

#### Frontend  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/IkanshGoyal/InstaEdit.git  
   cd instaedit  
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Start the development server:  
   ```bash  
   npm start  
   ```  

#### Backend  
1. Install dependencies:  
   ```bash  
   pip install -r requirements.txt  
   ```  
2. Start the Flask server:  
   ```bash  
   python app.py  
   ```  

---

## 🖼️ **Using the Image Editor**  

1. **Upload an Image**: Click the "Upload Image" button to select an image from your device.  
2. **Apply Filters**: Choose from a variety of preset filters to enhance your image.  
3. **Adjust Settings**: Fine-tune brightness, contrast, exposure, and other parameters.  
4. **Add Text**: Customize text with options for font, size, color, opacity, and rotation.  
5. **Crop & Rotate**: Use the crop tool to adjust the composition and rotate the image as needed.  
6. **ML-Powered Text Behind Objects**: Click "Apply Text Behind Object" to place text behind objects in the image.  
7. **Save Your Work**: Click "Save Image" to download the edited image.  

---

## 🤖 **ML-Powered Text Behind Objects**  

This feature uses a **PyTorch-based object segmentation model** to generate a mask array that identifies objects in the image. Here’s how it works:  

1. The user uploads an image.  
2. The image is sent to the Flask backend, where the PyTorch model processes it.  
3. The model generates a mask array that defines the object boundaries.  
4. The frontend uses this mask to place text behind objects while preserving the natural look of the image.  

---

## 📂 **Project Structure**  

```  
instaedit/  
   ├── public/  
   ├── src/  
   │   ├── components/        # React components  
   │   ├── App.js             # Main application component  
   │   └── index.js           # Entry point  
   ├── package.json           # Frontend dependencies  
   ├── app.py                 # Flask application   
   ├── requirements.txt       # Backend dependencies  
   ├── README.md              # Project documentation
   ├── AWS-Sagemaker/Code     # AWS Sagemaker dependencies
   └── notebook               # Model development 
```  

---

## 🙏 **Credits**  
- Developed by **Ikansh** and **Ujjawal**.  
- Special thanks to the open-source community for the amazing tools and libraries that made this project possible.  
 

---


Feel free to explore the project, contribute, or reach out with any questions! Happy coding! 😊  

--- 

#React #Flask #PyTorch #AI #ImageEditing #WebDevelopment #OpenSource #GitHub
