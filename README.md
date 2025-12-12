---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
    ReservedCode1: 304502202e5ae7cb181dfd92e1b6009fbed7f2b6ffe02c96309d945f018eae0ee1c06223022100efb254fbb13a9cead3aadc993da25e256e0d3388b15e8fecb49ac1917ead3544
    ReservedCode2: 304502202d79065390fe68a2971bc1fd9c93876a9615446933126f8c3fb828b67d9485d6022100e4dc372d82f1524b904b0c278c304fe60fb2931f5f6539a467cc2bbd20fe44b9
---

# Telegram Mini App - Token Earner

A professional Telegram Mini App for earning tokens through link visits. Built with native Telegram Web App SDK integration, modern UI/UX, and comprehensive token earning system.

## 🚀 Features

### Core Functionality
- **Token Earning System**: Users earn 100 tokens per successful link visit
- **10-Second Timer**: Ensures proper engagement before rewarding tokens
- **Link Integration**: Opens the specified link `https://link.gigapub.tech/l/wcz5o9fvu`
- **Persistent Storage**: Local storage maintains token balance and earning history
- **Professional UI**: Modern, responsive design with smooth animations

### Telegram Integration
- **Native Web App SDK**: Full integration with Telegram's Web App API
- **Theme Adaptation**: Automatically adapts to user's Telegram theme (light/dark)
- **Haptic Feedback**: Provides tactile feedback for user interactions
- **Telegram UI Elements**: Main button, back button, and proper navigation
- **User Authentication**: Leverages Telegram's built-in user authentication

### User Experience
- **Responsive Design**: Optimized for mobile devices and various screen sizes
- **Smooth Animations**: Micro-interactions and transitions for better UX
- **Loading States**: Visual feedback during operations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Accessibility**: Support for reduced motion preferences and focus states

## 📱 How It Works

1. **Initial State**: Users see their current token balance and a "Visit Link & Earn" button
2. **Link Visit**: Clicking the button opens the specified link in a new tab/browser
3. **Timer Start**: A 10-second countdown begins after clicking
4. **Wait Period**: Users must wait the full 10 seconds (button shows countdown)
5. **Claim Rewards**: After timer completion, users can claim their 100 tokens
6. **History Tracking**: All earning activities are logged with timestamps

## 🛠️ Setup Instructions

### 1. Create a Telegram Bot
```bash
# Message @BotFather on Telegram
/newbot
# Follow the prompts to create your bot
# Save the bot token
```

### 2. Configure Bot Commands
```bash
# Set up the Mini App command
/setinline
# Choose your bot and configure inline mode

# Set up the main Mini App
/setmainmenu
# Configure the Mini App menu button
```

### 3. Deploy the Application
1. Upload the files (`index.html`, `styles.css`, `app.js`) to your web server
2. Ensure HTTPS is enabled (required for Telegram Mini Apps)
3. Note your application's URL

### 4. Configure Mini App in BotFather
```bash
# Set the Mini App URL
/setappdomain
# Enter your domain: your-domain.com

# Set Mini App parameters
/setmenubutton
# Configure the menu button to launch your Mini App
```

### 5. Set Webhook (Optional)
If using a custom backend, set up webhooks for bot interactions.

## 📁 File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Professional CSS styling
├── app.js             # Application logic and Telegram integration
└── README.md          # This documentation
```

## 🎨 Design Features

### Color System
- **Dynamic Theming**: Adapts to Telegram's theme colors
- **Token Gold**: `#FFB800` for token-related elements
- **Success Green**: `#34C759` for completed actions
- **Timer Orange**: `#FF9500` for countdown states

### Typography
- **System Font Stack**: Native system fonts for optimal performance
- **Hierarchical Scale**: Clear typography hierarchy (48px hero, 16px body)
- **Proper Line Heights**: Optimized readability on mobile

### Animations
- **Balance Pulse**: Animated token counter updates
- **Button States**: Smooth transitions between different button states
- **Slide-in Effects**: History items animate in smoothly
- **Toast Notifications**: Slide-in feedback messages

## 🔧 Customization

### Changing the Target Link
Edit `app.js` and update the `targetUrl` variable:
```javascript
this.targetUrl = 'https://your-custom-link.com/path';
```

### Modifying Token Amount
Update the `earnAmount` variable:
```javascript
this.earnAmount = 150; // Change from 100 to 150 tokens
```

### Adjusting Timer Duration
Modify the `timerDuration` variable:
```javascript
this.timerDuration = 15; // Change from 10 to 15 seconds
```

### Customizing Colors
Update CSS custom properties in `styles.css`:
```css
:root {
  --token-gold: #your-gold-color;
  --success-green: #your-green-color;
  --timer-warning: #your-orange-color;
}
```

## 🔒 Security Considerations

### Data Validation
- All user data is validated server-side (implement backend validation)
- Token earning is tracked locally but should be verified on a secure backend
- Consider implementing server-side webhook validation for production

### HTTPS Requirement
- Telegram Mini Apps require HTTPS deployment
- Ensure your hosting provider supports SSL certificates

### Bot Token Security
- Keep your bot token secure and never expose it in client-side code
- Use environment variables for sensitive configuration

## 📊 Analytics Integration

The app is prepared for analytics integration. Add tracking events in `app.js`:

```javascript
// Example: Track token earnings
const trackEvent = (eventName, properties) => {
  // Add your analytics tracking here
  console.log('Analytics Event:', eventName, properties);
};

// Track when user earns tokens
trackEvent('token_earned', {
  amount: this.earnAmount,
  total_balance: this.tokenCount
});
```

## 🐛 Troubleshooting

### Common Issues

**Mini App not loading in Telegram**
- Verify HTTPS is enabled
- Check that the domain is properly configured in BotFather
- Ensure all files are uploaded correctly

**Tokens not saving**
- Check browser local storage is enabled
- Verify JavaScript is not blocked
- Check console for any errors

**Timer not working**
- Ensure JavaScript is enabled
- Check that the page is not in background/paused state
- Verify no browser extensions are interfering

### Debug Mode
Add debug logging by setting:
```javascript
localStorage.setItem('debugMode', 'true');
```

## 📈 Future Enhancements

### Backend Integration
- User authentication and token verification
- Server-side earning validation
- Database storage for persistent data
- Real-time leaderboards

### Advanced Features
- Referral system for earning bonuses
- Daily streak rewards
- Achievement system
- Social sharing features
- Multiple link campaigns

### Monetization
- Telegram Stars integration for premium features
- Subscription tiers with enhanced earning rates
- Sponsored link campaigns

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 📞 Support

For technical support or questions about Telegram Mini App development, refer to:
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram BotFather](https://t.me/botfather)

---

Built with ❤️ for the Telegram Mini App ecosystem