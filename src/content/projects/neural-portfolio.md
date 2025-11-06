---
title: "Neural Portfolio"
description: "An Awwwards-worthy portfolio featuring neural network animations and cutting-edge web technologies"
image: "/images/projects/neural-portfolio.webp"
imageAlt: "Neural network visualization with animated particles and connections"
technologies: ["TypeScript", "Astro", "GSAP", "Canvas API"]
featured: true
displayOrder: 1
githubUrl: "https://github.com/username/neural-portfolio"
externalUrl: "https://portfolio.example.com"
startDate: 2024-01-15
status: "completed"
tags: ["animation", "performance", "canvas"]
---

# Neural Portfolio

A modern portfolio website that pushes the boundaries of web animation and performance. Features a real-time neural network visualization built with Canvas 2D, achieving 60fps on desktop while maintaining accessibility standards.

## Key Features

- **Neural Network Hero**: Real-time particle system with adaptive performance
- **Magnetic Menu**: Cursor-aware navigation with proximity effects
- **Hexagonal Grid**: CSS-only responsive layout for project showcase
- **Performance First**: Lighthouse score of 100 across all metrics

## Technical Highlights

Built with Astro's Islands architecture for zero JavaScript by default, selectively hydrating only interactive components. GSAP powers smooth animations while respecting user preferences for reduced motion.

## Challenges & Solutions

The main challenge was balancing visual complexity with performance. Solved by implementing adaptive quality settings based on device capabilities, reducing particle count and disabling effects on lower-end devices while maintaining the core experience.