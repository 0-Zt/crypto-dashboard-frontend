# Crypto Analysis Dashboard

Aplicación profesional para análisis técnico de criptomonedas con indicadores avanzados y sugerencias de trading.

## Características Principales

- Análisis en tiempo real de criptomonedas de Binance Futures
- Múltiples marcos temporales (1m, 5m, 15m, 30m, 1h, 4h, 1d)
- Indicadores técnicos avanzados (EMA, Bollinger Bands, RSI, etc.)
- Sugerencias de trading basadas en análisis técnico
- Calculadora de posiciones con gestión de riesgo
- Interfaz moderna y responsiva

## Requisitos

### Backend
- Python 3.9+
- FastAPI
- python-binance
- pandas
- pandas-ta
- numpy

### Frontend
- Node.js 16+
- React 18
- TradingView Lightweight Charts
- Material-UI
- Axios

## Instalación

1. Clonar el repositorio
2. Instalar dependencias del backend:
```bash
cd backend
pip install -r requirements.txt
```

3. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

## Ejecución

1. Iniciar el backend:
```bash
cd backend
uvicorn main:app --reload
```

2. Iniciar el frontend:
```bash
cd frontend
npm start
```
