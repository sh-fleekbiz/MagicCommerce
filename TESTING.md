# MagicCommerce E2E Test Plan

This document outlines the end-to-end (E2E) test cases for the MagicCommerce platform, including comprehensive testing for all AI-powered features. The test suite is designed with a **mobile-first mindset** to ensure a high-quality user experience on the most common devices.

## Testing Framework

- **Framework**: [Playwright](https://playwright.dev/)
- **Browsers**: Chromium (for automated tests), with manual verification for Safari (WebKit) and Firefox.
- **Default Viewport**: Mobile (emulating a Pixel 5)

## How to Run Tests

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   ```bash
   cp .env.example .env
   # Fill in the required variables
   ```

3. **Run the E2E Tests**:
   ```bash
   npm run test:e2e
   ```

---

## Test Cases

### 1. Core E-commerce Flow (Anonymous User)

| Field                   | Details                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID & Title**  | `E2E-C1-001`: View and Add Product to Cart                                                                                                                           |
| **Preconditions / Setup** | The application is running, and the database is seeded with products.                                                                                               |
| **Test Steps**            | 1. Navigate to the home page. <br> 2. Verify that a list of products is displayed. <br> 3. Click on a product to view its details. <br> 4. Click the "Add To Cart" button. <br> 5. Verify that the cart icon in the header updates with the correct item count. <br> 6. Navigate to the cart page. |
| **Test Data**             | N/A                                                                                                                                                                 |
| **Expected Result**     | The selected product should be added to the cart, and the cart should display the correct product, quantity, and total price.                                         |
| **Pass/Fail Criteria**    | **Pass**: The product is successfully added to the cart, and the cart's state is updated correctly. <br> **Fail**: The product is not added, or the cart's state is incorrect. |
| **Type of Testing**       | Functional, UI/UX (Mobile & Desktop)                                                                                                                                |

---

### 2. User Authentication

| Field                   | Details                                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID & Title**  | `E2E-A1-001`: User Registration and Login                                                                                                                            |
| **Preconditions / Setup** | The application is running.                                                                                                                                        |
| **Test Steps**            | 1. Navigate to the login page. <br> 2. Click the "Register" link. <br> 3. Fill out the registration form with valid data. <br> 4. Submit the form. <br> 5. Verify that the user is redirected to the home page and is in a logged-in state. <br> 6. Log out. <br> 7. Log back in with the newly created credentials. |
| **Test Data**             | - Username: `testuser` <br> - Email: `test@example.com` <br> - Password: `password123`                                                                                  |
| **Expected Result**     | The user should be able to register a new account, log out, and log back in successfully.                                                                            |
| **Pass/Fail Criteria**    | **Pass**: The user can register and log in. <br> **Fail**: Registration or login fails.                                                                              |
| **Type of Testing**       | Functional                                                                                                                                                         |

---

### 3. Authenticated Checkout Flow

| Field                   | Details                                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID & Title**  | `E2E-C2-001`: Complete Checkout Process                                                                                                                              |
| **Preconditions / Setup** | The user is logged in and has at least one item in their cart.                                                                                                       |
| **Test Steps**            | 1. Navigate to the cart page. <br> 2. Click the "Checkout" button. <br> 3. Fill in the shipping address form. <br> 4. Proceed to the payment step. <br> 5. Enter mock payment details. <br> 6. Complete the purchase. |
| **Test Data**             | - Shipping Address: 123 Main St, Anytown, USA <br> - Mock Payment Info (e.g., Stripe's test card numbers)                                                              |
| **Expected Result**     | The user should be able to complete the checkout process and be redirected to a success page. A new order should be created and visible in the user's order history. |
| **Pass/Fail Criteria**    | **Pass**: Checkout is successful, and an order is created. <br> **Fail**: Checkout fails at any step.                                                                 |
| **Type of Testing**       | Functional, Data Validation                                                                        |

---

## 🤖 AI Features Testing

### 4. Semantic Search with Vector Embeddings

| Field                   | Details                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID & Title**  | `AI-S1-001`: Vector-powered semantic search                                                                                                                         |
| **Preconditions / Setup** | Azure AI Search index initialized with embeddings, feature flags enabled                                                                                             |
| **Test Steps**            | 1. Navigate to the home page. <br> 2. Enter semantic query like "wireless headphones for gaming". <br> 3. Verify search results are relevant. <br> 4. Test fallback with non-semantic query. <br> 5. Verify vector search toggle functionality. |
| **Test Data**             | Queries: "laptop for students", "phone case with protection", "comfortable office chair"                                                                             |
| **Expected Result**     | Results should show semantically related products, even if exact keywords don't match. Fallback to keyword search should work when vector search fails.                 |
| **Pass/Fail Criteria**    | **Pass**: Semantic search returns relevant products with high relevance scores. <br> **Fail**: Search returns irrelevant results or fails completely.                   |
| **Type of Testing**       | Functional, AI/ML, Performance                                                                                                                                      |

---

### 5. Enhanced AI Shopping Assistant

| Field                   | Details                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID & Title**  | `AI-C1-001`: AI chat with personalized recommendations                                                                                                              |
| **Preconditions / Setup** | AI chat feature enabled, user session created, products in catalog                                                                                                  |
| **Test Steps**            | 1. Open AI chat widget. <br> 2. Ask product-related question. <br> 3. Add items to cart. <br> 4. Ask for cart analysis. <br> 5. Verify personalized recommendations appear. <br> 6. Test conversation context persistence. |
| **Test Data**             | Questions: "What phone case works with iPhone 15?", "Analyze my cart", "Recommend accessories for laptop"                                                           |
| **Expected Result**     | AI should provide relevant answers, cart insights, and personalized product recommendations based on context.                                                         |
| **Pass/Fail Criteria**    | **Pass**: AI responses are helpful, recommendations are relevant, context is maintained. <br> **Fail**: AI gives generic responses or recommendations are irrelevant. |
| **Type of Testing**       | Functional, AI/ML, UX                                                                                                                                               |

---

### 6. Visual Search

| Field                   | Details                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID & Title**  | `AI-V1-001`: Image-based product search                                                                                                                             |
| **Preconditions / Setup** | Visual search feature enabled, test images prepared                                                                                                                 |
| **Test Steps**            | 1. Click camera icon in search. <br> 2. Upload product image. <br> 3. Verify AI analyzes image. <br> 4. Check search results match visual content. <br> 5. Test with different image types. |
| **Test Data**             | Images: Product photos, lifestyle images, different angles                                                                                                          |
| **Expected Result**     | AI should generate accurate descriptions and return visually similar products.                                                                                      |
| **Pass/Fail Criteria**    | **Pass**: Visual search returns relevant products based on image content. <br> **Fail**: No results or irrelevant products returned.                                 |
| **Type of Testing**       | Functional, AI/ML, Computer Vision                                                                                                                                  |

---

### 7. Personalized Recommendations

| Field                   | Details                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID & Title**  | `AI-P1-001`: Behavior-driven product recommendations                                                                                                                |
| **Preconditions / Setup** | Personalization enabled, user tracking functional                                                                                                                  |
| **Test Steps**            | 1. Browse specific product categories. <br> 2. View product details. <br> 3. Add items to cart. <br> 4. Check recommendation widgets. <br> 5. Verify recommendations reflect browsing history. |
| **Test Data**             | User behavior: View electronics, browse books, add phone to cart                                                                                                   |
| **Expected Result**     | Recommendations should be personalized based on user's viewing and interaction history.                                                                            |
| **Pass/Fail Criteria**    | **Pass**: Recommendations show relevant products based on behavior. <br> **Fail**: Generic recommendations unrelated to user activity.                              |
| **Type of Testing**       | Functional, AI/ML, Personalization                                                                                                                                  |

---

### 8. Admin AI Tools

| Field                   | Details                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID & Title**  | `AI-A1-001`: Price optimization and content generation                                                                                                              |
| **Preconditions / Setup** | Admin access available, AI admin endpoints enabled                                                                                                                 |
| **Test Steps**            | 1. Test price optimization API. <br> 2. Generate product descriptions. <br> 3. Simulate price changes. <br> 4. Initialize embeddings. <br> 5. Verify all admin tools work correctly. |
| **Test Data**             | Product ID for testing, price change scenarios                                                                                                                      |
| **Expected Result**     | All admin AI tools should provide actionable insights and generated content.                                                                                        |
| **Pass/Fail Criteria**    | **Pass**: Admin tools return useful analysis and content. <br> **Fail**: Tools return errors or useless data.                                                        |
| **Type of Testing**       | Functional, Admin, AI/ML                                                                                                                                            |

---

## 🧪 AI Testing Procedures

### Test Environment Setup

```bash
# Enable all AI features
NEXT_PUBLIC_FEATURE_AI_CHAT=true
NEXT_PUBLIC_FEATURE_AI_SEARCH=true
NEXT_PUBLIC_FEATURE_VECTOR_SEARCH=true
NEXT_PUBLIC_FEATURE_ENHANCED_RECOMMENDATIONS=true
NEXT_PUBLIC_FEATURE_VISUAL_SEARCH=true

# Initialize embeddings
curl -X POST http://localhost:3000/api/admin/embeddings \
  -H "Content-Type: application/json" \
  -d '{"action": "initialize"}'
```

### Performance Testing

#### AI Response Time Tests
- **Chat Response**: < 4 seconds
- **Semantic Search**: < 2 seconds
- **Recommendations**: < 3 seconds
- **Visual Search**: < 5 seconds

### Error Handling Testing

#### AI Service Failures
1. **Azure OpenAI Unavailable**: Verify graceful fallback
2. **Azure Search Down**: Test keyword search fallback
3. **Invalid API Keys**: Check error messages
4. **Rate Limits**: Verify retry logic

---

**Last Updated:** November 21, 2025
**AI Features:** 8 comprehensive capabilities tested
