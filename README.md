# 🧬 Detector de Mutantes

Aplicación Angular que detecta si un humano es mutante basándose en su secuencia de ADN.

## ¿Qué hace?

Analiza secuencias de ADN (matrices de NxN) y detecta si hay **más de una secuencia** de 4 letras iguales (A, T, C, G) en cualquier dirección: horizontal, vertical o diagonal.

**Ejemplo de Mutante:**

```
A T G C G A
C A G T G C
T T A T G T
A G A A G G
C C C C T A
T C A C T G
```

## Cómo usar

### Desarrollo local

```bash
npm install
npm start
```

Abre `http://localhost:4200`

### Con Docker

**Producción (puerto 80):**

```bash
docker-compose up -d is-mutant-prod
```

**Desarrollo (puerto 4200):**

```bash
docker-compose --profile dev up -d is-mutant-dev
```

## Tecnologías

- Angular 21 con Signals
- Tailwind CSS
- TypeScript
- Docker + Nginx

## Tests

```bash
npm test
```
