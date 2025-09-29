# 🎨 Figma to MJML AI Agent

An intelligent AI-powered tool that converts Figma designs and images into responsive email templates using MJML. Transform your design mockups into production-ready HTML emails with cross-client compatibility.

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black)
![React](https://img.shields.io/badge/React-18-61DAFB)
![MJML](https://img.shields.io/badge/MJML-4.15.0-orange)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991)

## ✨ Features

- **🎯 Dual Input Methods**: Convert from Figma file URLs or upload images directly
- **🤖 Multi-Provider AI**: Uses OpenAI, Cohere, and other free AI providers with automatic fallback
- **🆓 No Quota Limits**: Multiple free AI alternatives + intelligent fallback system
- **📱 Responsive Design**: Generates mobile-optimized email templates
- **✅ Email Client Compatible**: Tested for compatibility across major email clients
- **🔍 Real-time Validation**: MJML validation with error reporting and auto-correction
- **🧠 Intelligent Fallback**: Always works even without AI - analyzes layouts automatically
- **🧪 Litmus Integration**: Optional email testing across 90+ email clients
- **💨 Fast Processing**: Optimized for quick conversion and compilation
- **🔄 Provider Chain**: Automatically tries multiple AI providers in order of preference

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Modern CSS with drag-and-drop interface
- **Backend**: Next.js API routes, Node.js
- **Email Framework**: MJML 4.15.0 for responsive email generation
- **AI Integration**: OpenAI GPT-4 for intelligent design analysis
- **Design APIs**: Figma API for design extraction
- **Testing**: Litmus API for cross-client email testing
- **File Processing**: Formidable for image uploads, Sharp for image processing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Figma Personal Access Token
- **AI Provider (choose one or more)**:
  - 🆓 **Cohere API** (5M tokens/month FREE - recommended)
  - 🆓 **Hugging Face** (Free community models)
  - 🆓 **No API keys** (Intelligent fallback always works)
  - 💰 OpenAI API (paid, premium quality)
- Litmus API Key (optional, for email testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vaibhav-bhoir/Figma-to-MJML-AI-Agent.git
   cd Figma-to-MJML-AI-Agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Required
   FIGMA_ACCESS_TOKEN=your_figma_personal_access_token
   
   # Optional (enables AI features)
   OPENAI_API_KEY=your_openai_api_key
   
   # Optional (enables email testing)
   LITMUS_API_USERNAME=your_litmus_username
   LITMUS_API_PASSWORD=your_litmus_password
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Method 1: Figma File Conversion

1. **Get your Figma file URL or ID**
   - Copy the Figma file URL (e.g., `https://www.figma.com/file/ABC123/YourDesign`)
   - Or extract just the file ID (`ABC123`)

2. **Paste into the Figma input field**
   - The tool automatically extracts the file ID
   - Supports both full URLs and file IDs

3. **Click "Convert to MJML"**
   - AI analyzes the design layout
   - Extracts email-suitable frames
   - Generates responsive MJML code

### Method 2: Image Upload

1. **Upload an image**
   - Drag and drop or click to select
   - Supports PNG, JPG, JPEG formats
   - Maximum file size: 10MB

2. **Automatic processing**
   - AI analyzes the image layout
   - Identifies text, buttons, and sections
   - Converts to structured MJML

### Output

The tool provides:
- **📄 Clean MJML Code**: Copy-ready MJML markup
- **🖥️ Compiled HTML**: Production-ready HTML email
- **⚡ Live Preview**: See how your email looks
- **🔍 Validation Report**: Errors and warnings
- **📊 Metadata**: Processing time, frame count, AI usage

## 🏗️ Project Structure

```
figma-to-mjml/
├── components/           # React components
│   ├── UploadForm.js    # File upload and URL input
│   └── ConversionResults.js # Results display
├── pages/
│   ├── api/             # API endpoints
│   │   ├── convert-figma.js    # Figma conversion
│   │   ├── convert-image.js    # Image conversion
│   │   ├── test-litmus.js      # Litmus testing
│   │   └── health.js           # Health check
│   ├── _app.js          # Next.js app configuration
│   └── index.js         # Main application page
├── lib/                 # Core libraries
│   ├── figma.js         # Figma API integration
│   ├── ai.js            # OpenAI integration
│   ├── mjml.js          # MJML processing
│   ├── vision.js        # Image analysis
│   ├── litmus.js        # Email testing
│   └── fallback-mjml.js # Fallback templates
├── styles/
│   └── globals.css      # Global styles
└── public/              # Static assets
```

## 🔧 API Endpoints

### `POST /api/convert-figma`
Convert Figma designs to MJML
```json
{
  "fileId": "your-figma-file-id"
}
```

### `POST /api/convert-image`
Convert uploaded images to MJML
- Content-Type: `multipart/form-data`
- Field name: `image`

### `POST /api/test-litmus`
Send emails to Litmus for testing
```json
{
  "html": "<html>...</html>",
  "subject": "Test Email"
}
```

### `GET /api/health`
Health check endpoint

## ⚙️ Configuration

### Figma API Setup

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Scroll to "Personal access tokens"
3. Generate a new token
4. Add to `.env.local` as `FIGMA_ACCESS_TOKEN`

### OpenAI API Setup

1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env.local` as `OPENAI_API_KEY`

### Litmus API Setup (Optional)

1. Sign up at [Litmus](https://litmus.com/)
2. Get your API credentials
3. Add to `.env.local`:
   - `LITMUS_API_USERNAME`
   - `LITMUS_API_PASSWORD`

## 🧪 Testing

### Run Test Scripts

```bash
# Test Figma API connection
node test-figma.js

# Test OpenAI integration
node test-ai.js

# Test MJML compilation
node test-mjml.js
```

### Manual Testing

1. **Test with sample Figma file**: Use the provided test file ID
2. **Upload test images**: Try various image formats and sizes
3. **Check email compatibility**: Use Litmus integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**❌ "Figma API error"**
- Check your `FIGMA_ACCESS_TOKEN` in `.env.local`
- Ensure the Figma file is public or you have access

**❌ "OpenAI API error: 429"**
- You've exceeded your OpenAI quota
- The tool will automatically use fallback mode

**❌ "No image file provided"**
- Ensure you're uploading a valid image file
- Check file size is under 10MB

**❌ "MJML validation errors"**
- The generated MJML has structural issues
- Try with a simpler design or different frame

### Getting Help

- Check the [Issues](https://github.com/vaibhav-bhoir/Figma-to-MJML-AI-Agent/issues) page
- Review the console output for detailed error messages
- Ensure all environment variables are properly set

## 🎯 Roadmap

- [ ] **Batch Processing**: Convert multiple designs at once
- [ ] **Template Library**: Pre-built email templates
- [ ] **Advanced AI**: Better layout recognition and conversion
- [ ] **Custom Branding**: Brand color and font detection
- [ ] **Export Options**: Save as files, send to email platforms
- [ ] **Collaboration**: Share and collaborate on templates

## 📈 Performance

- **Average conversion time**: 2-5 seconds
- **Supported file formats**: PNG, JPG, JPEG
- **Maximum file size**: 10MB
- **Figma frames supported**: Unlimited
- **Email client compatibility**: 90+ clients via Litmus

---

**Built with ❤️ by [Vaibhav Bhoir](https://github.com/vaibhav-bhoir)**

*Transform your designs into beautiful, responsive emails with the power of AI!*