# 🚀 Calanco Portfolio API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">
  A comprehensive portfolio API showcasing modern backend development with NestJS, TypeScript, and Supabase
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
</p>

## 📖 Description

This is a feature-rich REST API built as a portfolio project to demonstrate advanced backend development skills. The API includes a complete e-commerce system with product management, shopping cart functionality, order processing, and additional features like weather forecasting.

## ✨ Features

### 🛍️ E-commerce Core
- **Product Management**: Complete CRUD operations for products with validation
- **Shopping Cart**: Advanced cart system with automatic creation and item management
- **Order Processing**: Secure checkout and order tracking system

### 🌤️ Weather Integration
- **Weather Forecasting**: Real-time weather data with configurable forecast days
- **Location-based**: Get weather information for any city worldwide

### 🏗️ Architecture & Best Practices
- **Clean Architecture**: Modular design with dependency injection
- **Interface-based Design**: Loose coupling with TypeScript interfaces
- **Input Validation**: Comprehensive DTO validation with class-validator
- **Error Handling**: Consistent error responses across all endpoints
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Database Integration**: Supabase PostgreSQL with type safety

### 🔧 Technical Features
- **UUID Generation**: Secure ID generation for all entities
- **CORS Support**: Cross-origin resource sharing enabled
- **Global Exception Filters**: Centralized error handling
- **Swagger Documentation**: Auto-generated API documentation

## 🏛️ API Structure

```
📁 src/
├── 🛍️ products/          # Product management module
├── 🛒 cart/              # Shopping cart functionality
├── 📦 orders/            # Order processing system
├── 🌤️ weather/           # Weather forecast service
├── 🔧 common/            # Shared utilities and services
├── 📊 supabase/          # Database integration
└── ⚙️ config/            # Application configuration
```

## 🚀 API Endpoints

### Products API
```http
GET    /products           # Get all products
GET    /products/:id       # Get product by ID
POST   /products           # Create new product
PUT    /products/:id       # Update product
DELETE /products/:id       # Delete product
```

### Cart API
```http
GET    /cart/:id           # Get cart (auto-creates if empty UUID)
POST   /cart/:id/items     # Add item to cart
DELETE /cart/:id/items/:productId  # Remove item from cart
DELETE /cart/:id           # Clear entire cart
```

### Orders API
```http
POST   /orders/checkout    # Checkout cart and create order
GET    /orders/:id         # Get order details
```

### Weather API
```http
GET    /weather?city={city}&days={days}  # Get weather forecast
```

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **HTTP Client**: Axios
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd calanco-portfolio-api

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Weather API Configuration
WEATHER_API_KEY=your_weather_api_key
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations from the `migrations/` folder in your Supabase SQL editor
3. Update your `.env` file with your Supabase credentials

## 🚀 Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

### 📚 API Documentation

Once the application is running, you can access the interactive Swagger documentation at:
`http://localhost:3000/api`

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode for development
npm run test:watch

# End-to-end tests
npm run test:e2e

# Test coverage report
npm run test:cov
```

## 💡 Usage Examples

### Creating a Product
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Keyboard",
    "description": "Mechanical RGB keyboard",
    "price": 89.99
  }'
```

### Adding Item to Cart
```bash
curl -X POST http://localhost:3000/cart/00000000-0000-0000-0000-000000000000/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "your-product-id",
    "quantity": 2
  }'
```

### Checkout Order
```bash
curl -X POST http://localhost:3000/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "your-cart-id"
  }'
```

### Get Weather Forecast
```bash
curl "http://localhost:3000/weather?city=Rome&days=3"
```

## 🏗️ Architecture Highlights

### Modular Design
The application follows NestJS best practices with a modular architecture:
- Each feature is encapsulated in its own module
- Services implement interfaces for better testability
- Dependency injection throughout the application

### Smart Cart System
- **Auto-creation**: Carts are automatically created when adding items with an empty UUID
- **UUID validation**: All IDs are validated using proper UUID format
- **Atomic operations**: Cart operations are handled transactionally

### Consistent API Responses
All endpoints return a standardized response format:
```typescript
{
  type: "success" | "error",
  status: number,
  message: string,
  data?: any,
  timestamp: Date
}
```

## 📊 Database Schema

### Products Table
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `price` (Decimal)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Carts Table
- `id` (UUID, Primary Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Cart Lines Table
- `id` (UUID, Primary Key)
- `cart_id` (UUID, Foreign Key)
- `product_id` (UUID, Foreign Key)
- `quantity` (Integer)

### Orders Table
- `id` (String, Primary Key)
- `total_amount` (Decimal)
- `status` (Enum)
- `viewed` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### Project Structure
```
src/
├── app.module.ts           # Root module
├── main.ts                 # Application bootstrap
├── cart/                   # Cart management
│   ├── dto/               # Data transfer objects
│   ├── entities/          # Database entities
│   ├── interfaces/        # Service interfaces
│   └── cart.service.ts    # Business logic
├── products/              # Product management
├── orders/                # Order processing
├── weather/               # Weather service
├── common/                # Shared utilities
└── supabase/              # Database integration
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=your_production_supabase_url
SUPABASE_KEY=your_production_supabase_key
WEATHER_API_KEY=your_weather_api_key
```

<!-- ## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request -->

<!-- ## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## 👨‍💻 Author

**Calanco** - Portfolio API Project

- GitHub: [@FraBzz](https://github.com/FraBzz)
<!-- - LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile) -->

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/) - A progressive Node.js framework
- Database powered by [Supabase](https://supabase.com/)
- Documentation with [Swagger](https://swagger.io/)
- Weather data from external weather API

---

<p align="center">
  Made with ❤️ for learning and demonstration purposes
</p>
