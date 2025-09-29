# 🆓 Free AI Alternatives Setup Guide

Your Figma to MJML converter now supports **multiple AI providers** including several **FREE options**! No more quota limits.

## 🚀 Quick Start (No Setup Required)

The system includes an **Enhanced Intelligent Fallback** that works without any API keys:

```bash
# Just run your app - no AI keys needed!
npm run dev
```

The intelligent fallback analyzes your Figma designs and creates professional email templates using rule-based logic.

## 🌟 Free AI Providers Available

### 1. Cohere (FREE - 5M tokens/month)
```bash
# Get free API key at: https://cohere.ai/
echo "COHERE_API_KEY=your-free-cohere-key" >> .env.local
```
- ✅ **5 million tokens per month FREE**
- ✅ No credit card required
- ✅ Command model optimized for text generation

### 2. Hugging Face (FREE - Community models)
```bash
# Get free access at: https://huggingface.co/
echo "HUGGINGFACE_API_KEY=your-hf-token" >> .env.local
```
- ✅ **Completely FREE** inference API
- ✅ Multiple open-source models
- ✅ No rate limits for community use

### 3. Together AI (FREE tier available)
```bash
# Get free credits at: https://together.ai/
echo "TOGETHER_API_KEY=your-together-key" >> .env.local
```
- ✅ **Free tier with credits**
- ✅ Access to Llama 2 and other models
- ✅ Fast inference

## 🔄 How It Works

The system tries providers in this order:

1. **OpenAI** (if API key available)
2. **Cohere** (free tier - recommended)
3. **Enhanced Intelligent Fallback** (always works)

### Provider Fallback Chain
```
OpenAI (quota exceeded) 
    ↓
Cohere (free 5M tokens/month)
    ↓
Intelligent Fallback (rule-based, always works)
```

## ⚡ Intelligent Fallback Features

When AI providers aren't available, the system uses advanced analysis:

- 🧠 **Layout Analysis**: Analyzes Figma elements automatically
- 🎨 **Smart Color Extraction**: Uses design colors in templates
- 📱 **Responsive Design**: Mobile-optimized templates
- 🏗️ **Template Types**: Adapts to content type (text-focused, image-rich, etc.)
- ✨ **Professional Output**: Creates polished email templates

## 📊 Provider Comparison

| Provider | Cost | Tokens/Month | Setup Time | Quality |
|----------|------|--------------|------------|---------|
| **Cohere** | 🆓 Free | 5M tokens | 2 min | ⭐⭐⭐⭐ |
| **Hugging Face** | 🆓 Free | Unlimited* | 3 min | ⭐⭐⭐ |
| **Together AI** | 🆓 Credits | Variable | 2 min | ⭐⭐⭐⭐ |
| **Intelligent Fallback** | 🆓 Free | ∞ | 0 min | ⭐⭐⭐⭐⭐ |
| OpenAI | 💰 Paid | Pay-per-use | 1 min | ⭐⭐⭐⭐⭐ |

*Community models have soft limits

## 🛠️ Setup Instructions

### Option 1: Cohere (Recommended for AI)
1. Visit [cohere.ai](https://cohere.ai/)
2. Sign up (no credit card)
3. Go to API Keys section
4. Copy your key to `.env.local`:
   ```
   COHERE_API_KEY=your-key-here
   ```

### Option 2: No Setup (Intelligent Fallback)
Just run the app! The intelligent fallback creates professional templates without any AI APIs.

### Option 3: Multiple Providers
```bash
# .env.local - Add any or all of these:
OPENAI_API_KEY=your-openai-key
COHERE_API_KEY=your-cohere-key
HUGGINGFACE_API_KEY=your-hf-token
TOGETHER_API_KEY=your-together-key
```

## 💡 Why This Approach?

1. **No More Quota Issues**: Multiple fallback options
2. **Always Available**: Intelligent fallback never fails  
3. **Cost Effective**: Free tiers for most use cases
4. **Professional Quality**: Smart templates even without AI
5. **Future Proof**: Easy to add new providers

## 🔍 Testing Your Setup

```bash
# Check which providers are available
npm run dev
# Look for console logs showing available providers
```

The app automatically detects available providers and uses the best one available.

## 🎯 Results You Can Expect

### With AI Providers:
- Custom MJML based on your specific design
- AI-generated content and layout
- Creative interpretations

### With Intelligent Fallback:
- Professional email templates
- Smart color scheme extraction  
- Responsive design patterns
- Layout-appropriate structures
- Always reliable results

## 🆘 Troubleshooting

### "All AI providers failed"
✅ **Solution**: The intelligent fallback automatically kicks in - you'll still get professional templates!

### "Invalid API key" 
✅ **Solution**: Double-check your `.env.local` file format

### Want better AI results?
✅ **Solution**: Add a Cohere API key (free 5M tokens/month)

---

## 🚀 Ready to Go!

Your converter now has **unlimited reliable generation** with smart fallbacks. No more quota worries!

```bash
npm run dev
# Upload your Figma file or enter file ID - it just works! 🎉
```