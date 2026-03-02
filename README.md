# 🍵 Milk Tea Telegram Bot

**Entry Test – Intern Software Engineer 2026**

This project is a Telegram Bot developed as part of the **Intern Software Engineer 2026 Entry Test** for  
**CASSO COMPANY LIMITED** – LK8 D9 Street, Thien An Nguyen Urban Area, Dong Hoa Ward, Ho Chi Minh City, Vietnam.

The bot helps automate milk tea ordering via Telegram, replacing manual chat-based ordering (e.g. Zalo) to reduce mistakes, waiting time, and operational overload.

---

## 🖼 UI Preview

<table>
  <tr>
    <td align="center">
      <img src="public/screenshots/menu-selection.png" width="100%" />
    </td>
    <td align="center">
      <img src="public/screenshots/order-confirm.png" width="100%" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/screenshots/order-created-for-customer.png" width="100%" />
    </td>
    <td align="center">
      <img src="public/screenshots/admin-new-order-notif.png" width="100%" />
    </td>
  </tr>
  <tr>
  <td colspan="2" align="center">
    <em>
      <b>Customer flow</b>: selecting menu items, confirming the order, and receiving order confirmation.<br>
      <b>Admin flow</b>: receiving new order notifications and managing customer orders via the Telegram bot.
    </em>
  </td>
</tr>
</table>

---

## 🧠 Problem Context

A small milk tea shop mainly serves customers in-office areas.  
Due to high demand, many customers place orders via chat applications.

**Current issues:**

- Orders are handled manually via chat
- Messages are easily missed or replied late
- Orders are confused or incorrect
- Customers wait too long and become dissatisfied

---

## 🎯 Goal

Build a **Telegram Bot** that:

- Automatically chats with customers
- Collects milk tea orders
- Calculates total price
- Confirms the order
- Sends order details to the shop owner for preparation

The solution focuses on **real-world usability**, **stability**, and **maintainability**.

---

## 🤖 Bot Features

### Customer Features

- 📩 Interactive ordering via Telegram bot chat
- 🧾 Menu-based order selection
- ➕ Quantity & item management
- 💰 Automatic total price calculation
- ✅ Order confirmation
- 📜 View order history (list of previously placed orders via the bot)
- 🔍 View detailed order information (items, quantities, total price)
- 🔔 Receive order status updates directly via the Telegram bot  
  (e.g. pending → confirmed → completed)

### Admin / Shop Owner Features

- 📤 Receive new order notifications via the Telegram bot with full order details
- 📋 View customer order list directly in the Telegram bot
- 🔍 View detailed order information (customer, items, total price)
- 🔄 Update order status through bot actions (pending → confirmed → completed)
- 📢 Automatically notify customers via the Telegram bot when order status changes

---

## 🛠 Tech Stack

### Core Technologies

- **Node.js** – JavaScript runtime
- **NestJS** – Backend framework
- **TypeScript** – Strongly typed JavaScript
- **Telegram Bot API** – Bot communication layer
- **nestjs-telegraf** – Telegram integration for NestJS

### Data & Persistence

- **PostgreSQL** – Primary relational database
- **TypeORM** – ORM for database access
- **Supabase** – Managed PostgreSQL & infrastructure services

### Infrastructure (Extendable)

- **Redis** – Session & state management
- **Webhook deployment** – Production-ready bot integration

---

## 🧱 Project Structure

```text
milk-tea-telegram-bot
├── public/                     # Static assets (images, files, etc.)
├── src/
│   ├── common/                 # Shared utilities, constants, helpers, enums
│   ├── config/                 # Application & environment configuration
│   ├── modules/                # Business logic & feature modules
│   │   ├── database/           # Database configuration & TypeORM setup
│   │   ├── menu/               # Milk tea menu management logic
│   │   ├── order/              # Order creation, processing & status management
│   │   └── telegram/           # Telegram bot handlers (commands, actions, listeners)
│   ├── app.controller.ts       # Root controller (health check / base endpoint)
│   ├── app.service.ts          # Root service (shared app-level logic)
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application entry point (bootstrap NestJS app)
├── test/                       # Unit tests & End-to-End tests
├── .env.example                # Environment variables template
├── package.json                # Project dependencies & npm scripts
├── nest-cli.json               # NestJS CLI configuration
├── tsconfig.json               # TypeScript compiler configuration
└── README.md                   # Project documentation
```

---

## 🏗 System Architecture Diagram

```mermaid
flowchart TD
    A[Customer / Admin] -->|Telegram Messages & Actions| B[Telegram Bot]
    B -->|nestjs-telegraf| C[NestJS Application]

    C --> D[Telegram Module]
    C --> E[Order Module]
    C --> F[Menu Module]

    D --> G[TypeORM]
    E --> G
    F --> G

    G --> H[(PostgreSQL)]
    H --> I[Supabase]
```

---

### Architecture Components

#### 1. Telegram Layer

- Handles all incoming messages, commands, and button actions
- Built using **nestjs-telegraf**
- Acts as the single entry point for both customers and admins

#### 2. Application Layer (NestJS)

- Implements business rules and workflows
- Separates concerns into feature-based modules:
  - `telegram` – Bot commands & interaction logic
  - `order` – Order creation, status management
  - `menu` – Milk tea menu logic

#### 3. Persistence Layer

- Uses **TypeORM** to abstract database access
- Stores data in **PostgreSQL** managed by **Supabase**
- Ensures data consistency and easy schema evolution

---

### Design Principles

- **Modular architecture** for maintainability
- **Single communication channel** (Telegram Bot)
- **Clear separation of concerns**
- **Production-oriented design**, not a demo-only bot

---

### Scalability Considerations

The architecture allows easy extension with:

- Redis for session & state management
- Webhook-based deployment for higher traffic
- Payment integration
- Admin role expansion

---

## ▶️ How to Run the Project

### Prerequisites

Make sure the following are installed and available on your machine:

- **Node.js** version **18 or higher**
- **npm** version **9 or higher**
- **Git**
- A valid **Telegram Bot Token** (created via BotFather)
- A **Telegram User ID** (used for admin / shop owner notifications)
- **PostgreSQL** database (local or managed via Supabase)

> 💡 **Recommendation:**  
> It is recommended to have **two Telegram accounts** when testing the bot:
>
> - One account acts as the **customer**
> - One account acts as the **admin / shop owner**
>
> This setup helps simulate real-world usage and makes testing order flows and notifications more effective.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/lengocanh2005it/milk-tea-telegram-bot.git
cd milk-tea-telegram-bot
```

### 2️⃣ Environment Setup

Create the environment file from the example:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```bash
# ======================================================
# Application Environment
# ======================================================

# Application running mode
# Possible values: development | production
NODE_ENV=development

# Port that the NestJS application will run on
PORT=3000


# ======================================================
# Telegram Bot Configuration
# ======================================================

# Telegram Bot Token
# Get this token from @BotFather when creating a Telegram bot
TELEGRAM_TOKEN=your_telegram_bot_token

# Telegram User ID of the shop owner / admin
# Used to receive order notifications and manage orders
TELEGRAM_ADMIN_ID=your_telegram_user_id


# ======================================================
# Database Configuration
# ======================================================

# PostgreSQL connection URL
# Example:
# postgres://username:password@host:5432/database_name
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Run Database Migrations (Required)

Before seeding the database, run the existing migration files to create the required database schema.

```bash
npm run migration:run
```

> ⚠️ **Important:**  
> This step is required before running the seed script.  
> Migrations create the necessary database tables and relations used by the application.

### 5️⃣ Seed Initial Menu Data (Required)

Seed the milk tea menu data into the database:

```bash
npm run seed:menu
```

> ⚠️ **Important:**  
> This step is required before running the application.  
> The bot relies on menu data to handle customer orders.

### 6️⃣ Build the Project

Compile TypeScript into JavaScript:

```bash
npm run build
```

### 7️⃣ Run in Production Mode

Start the bot in production mode:

```bash
npm run start:prod
```

### 8️⃣ Verify Application Startup

After running the application, check the terminal logs.  
If you see output similar to the following:

```text
[Nest] 18796  - 03/02/2026, 11:02:24 AM     LOG [RouterExplorer] Mapped {/, GET} route +3ms
[Nest] 18796  - 03/02/2026, 11:02:24 AM     LOG [NestApplication] Nest application successfully started +5ms
Server is running on PORT 3000
```

This means:

- ✅ The NestJS application has started successfully
- ✅ The server is running on the configured port
- ✅ The Telegram Bot is now online and ready to receive messages

You can now open **Telegram**, search for **your bot**, and send the `/start` command to begin using it.

### 🧪 (Optional) Run in Development Mode

For local development with hot reload:

```bash
npm run start:dev
```

---

## 📘 Bot Usage Guide

A complete walkthrough of the bot functionality can be found in the following demo video:  
🎥 **Demo Video:** https://www.youtube.com/watch?v=LUdw9W96a9Q

### Quick Commands

#### Customer

- `/start` – Start ordering milk tea
- Follow bot instructions to select menu items and confirm the order
- Receive order status updates via Telegram bot

#### Admin

- Automatically receives new order notifications
- Uses bot actions to confirm and complete orders

---

## 🛠 Troubleshooting

- Bot does not respond:
  - Check `TELEGRAM_TOKEN`
  - Make sure the bot is not running elsewhere

- Admin does not receive notifications:
  - Verify `TELEGRAM_ADMIN_ID`
  - Ensure the admin has started the bot at least once

- Database connection error:
  - Verify `DATABASE_URL`
  - Ensure migrations have been run

---

## 🚀 Future Improvements

The system is designed to be easily extensible. Potential future enhancements include:

- 💳 Payment integration (QR payment, banking APIs)
- 🧠 AI-powered chat assistance for more natural ordering conversations
- 📊 Admin dashboard for order statistics and reporting
- 🔔 Real-time notifications with advanced order status tracking
- 🧾 Promotion, discount, and voucher management
- 🚚 Delivery integration and order scheduling

---

## 🤖 AI-Assisted Development

- AI-assisted coding tools were used to accelerate development and improve code quality.
- All core logic and architectural decisions were reviewed and validated manually.

---

## 📤 Submission Notes

This project is submitted as part of the  
**Intern Software Engineer 2026 Entry Test – CASSO COMPANY LIMITED**.

Submission includes:

- Source code (this repository)
- Demo video
- Solution analysis document (PDF)
- Deployed Telegram bot

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to:

- Use the source code for personal and commercial purposes
- Clone, fork, and modify the project
- Distribute and publish modified versions

Under the following conditions:

- The original copyright notice and license must be included in all copies or substantial portions of the software

This project is provided **"as is"**, without warranty of any kind.

---

## 👤 Author

**Ngoc Anh Le**  
Intern Software Engineer Candidate – 2026

GitHub: https://github.com/lengocanh2005it  
Email: lengocanhpyne363@gmail.com  
Phone: +84 393 873 630
