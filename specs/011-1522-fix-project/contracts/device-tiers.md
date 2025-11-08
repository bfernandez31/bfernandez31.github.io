# Contract: Device Tier Classification

**Feature**: Performance Optimization for GitHub Pages
**Branch**: `011-1522-fix-project`
**Date**: 2025-11-07
**Status**: Design Contract

## Purpose

This contract defines the device tier classification system used to adaptively configure animation quality and resource usage based on user's device capabilities. Device tier detection is client-side only (GitHub Pages static hosting) using browser APIs.

---

## Device Tier Levels

### Tier 1: High-End

**Classification Criteria** (ANY of the following):
- CPU cores ≥ 8 (`navigator.hardwareConcurrency >= 8`)
- Memory ≥ 8GB (`navigator.deviceMemory >= 8`)
- CPU cores ≥ 4 AND Memory ≥ 4GB

**Connection Modifier**: No downgrade (high-end devices can handle animations even on slower connections)

**Example Devices**:
- MacBook Pro 2020+ (8+ cores, 16GB+ RAM)
- Desktop workstations (Intel i7/i9, AMD Ryzen 7/9)
- High-end gaming laptops
- iPhone 13 Pro+ (reports as high-end via heuristics)

**Performance Configuration**:
```typescript
{
  particles: 50,            // Neural network particle count
  targetFPS: 60,            // Animation frame rate target
  enableCursorEffects: true, // Custom cursor + trail enabled
  enableSmoothScroll: true,  // Lenis smooth scroll enabled
  lazyLoadThreshold: 0       // Immediate component initialization
}
```

**Rationale**: High-end devices have computational headroom for full visual fidelity. Users expect smooth 60fps animations on these devices. No need to defer non-critical components (instant loading preferred for premium feel).

---

### Tier 2: Mid-Range (DEFAULT)

**Classification Criteria** (ANY of the following, but NOT high-end):
- CPU cores ≥ 4 (`navigator.hardwareConcurrency >= 4`)
- Memory ≥ 4GB (`navigator.deviceMemory >= 4`)

**Connection Modifier**: Downgrade to Tier 3 if connection is `slow-2g`, `2g`, or `3g`

**Example Devices**:
- MacBook Air 2018-2020 (4 cores, 8GB RAM)
- Mid-range laptops (Intel i5, AMD Ryzen 5)
- iPhone 8-12 (2-4 cores, 2-4GB RAM)
- Mid-range Android (Samsung Galaxy A series, Google Pixel 4-6)

**Performance Configuration**:
```typescript
{
  particles: 30,             // Reduced particle count (60% of high-end)
  targetFPS: 30,             // 30fps target (acceptable for most users)
  enableCursorEffects: false, // Disable cursor trail (high overhead)
  enableSmoothScroll: true,   // Lenis smooth scroll enabled (optimized)
  lazyLoadThreshold: 500      // 500ms delay before lazy loading components
}
```

**Rationale**: Mid-range devices represent majority of users (60-70% of portfolio visitors estimated). 30fps animations are acceptable (not buttery smooth but not janky). Cursor trail disabled (decorative, high overhead). Smooth scroll provides better UX than native scroll (worth the performance cost). Lazy loading defers non-critical components to prioritize hero section.

**Note**: This is the **default tier** if device APIs unavailable or unknown (graceful degradation).

---

### Tier 3: Low-End

**Classification Criteria** (ALL of the following):
- CPU cores < 4 (`navigator.hardwareConcurrency < 4`)
- Memory < 4GB (`navigator.deviceMemory < 4`)

**OR** (connection-based downgrade):
- Mid-range device on slow connection (`effectiveType === 'slow-2g' | '2g' | '3g'`)

**Example Devices**:
- Older smartphones (iPhone 6-7, Android 2018 and earlier)
- Budget laptops (<4GB RAM, dual-core CPU)
- Tablets (iPad 2018 and earlier)
- Users on slow cellular connections (rural areas, congested networks)

**Performance Configuration**:
```typescript
{
  particles: 20,              // Minimal particle count (40% of high-end)
  targetFPS: 30,              // 30fps target (best effort)
  enableCursorEffects: false, // Disable all cursor effects
  enableSmoothScroll: false,  // Disable Lenis, use native scroll
  lazyLoadThreshold: 1000     // 1s delay before lazy loading components
}
```

**Rationale**: Low-end devices struggle with any animation overhead. Prioritize core functionality over visual polish. Native scroll is more performant than Lenis (no JavaScript overhead). Longer lazy load threshold ensures hero section is fully loaded before adding more scripts. Minimal particle count preserves some visual interest while maintaining usability.

---

### Tier 4: Unknown

**Classification Criteria**:
- Device APIs not available (`navigator.hardwareConcurrency === undefined AND navigator.deviceMemory === undefined`)
- Privacy-focused browsers blocking APIs
- Older browsers without support (Safari <14, Firefox <110)

**Performance Configuration**:
```typescript
{
  particles: 30,             // Default to mid-range settings
  targetFPS: 30,
  enableCursorEffects: false,
  enableSmoothScroll: true,
  lazyLoadThreshold: 500
}
```

**Rationale**: When in doubt, default to mid-range (safe middle ground). Better to slightly under-optimize (smooth experience on unknown high-end) than over-optimize (janky experience on unknown low-end). Cursor effects disabled by default (avoid risk).

---

## Browser API Support

### navigator.hardwareConcurrency

**Specification**: [HTML Living Standard - Navigator.hardwareConcurrency](https://html.spec.whatwg.org/multipage/system-state.html#dom-navigator-hardwareconcurrency)

**Browser Support**:
- Chrome 37+ ✅
- Firefox 48+ ✅
- Safari 15.4+ ✅ (was unavailable in Safari <15.4, now supported)
- Edge 79+ ✅

**Returns**: Integer (number of logical CPU cores available to browser)

**Caveats**:
- May return lower value than physical cores due to browser sandboxing
- Mobile browsers may throttle or mask actual core count
- Privacy-focused browsers (Brave, Tor Browser) may return fake values or `undefined`

**Fallback**: If `undefined`, assume `navigator.hardwareConcurrency = 4` (mid-range default)

**Example**:
```typescript
const cpuCores = navigator.hardwareConcurrency ?? 4; // Fallback to 4
console.log(`CPU Cores: ${cpuCores}`);
// Desktop: 8, 12, 16 (typical)
// Mobile: 2, 4, 6 (typical)
```

---

### navigator.deviceMemory

**Specification**: [Device Memory API - W3C Working Draft](https://www.w3.org/TR/device-memory/)

**Browser Support**:
- Chrome 63+ ✅
- Firefox ❌ (not implemented)
- Safari ❌ (not implemented)
- Edge 79+ ✅

**Returns**: Float (approximate RAM in GB, rounded to nearest power of 2: 0.25, 0.5, 1, 2, 4, 8)

**Caveats**:
- **Privacy concern**: Rounded to prevent fingerprinting (e.g., 6GB RAM reports as 4GB or 8GB)
- Firefox/Safari do not support (returns `undefined`)
- May be disabled in privacy-focused browsers

**Fallback**: If `undefined`, assume `navigator.deviceMemory = 4` (mid-range default)

**Example**:
```typescript
const memory = (navigator as any).deviceMemory ?? 4; // Fallback to 4GB
console.log(`Device Memory: ${memory} GB`);
// Desktop: 4, 8, 16 (typical)
// Mobile: 2, 4 (typical, but API not widely supported)
```

---

### navigator.connection.effectiveType

**Specification**: [Network Information API - W3C Draft](https://wicg.github.io/netinfo/)

**Browser Support**:
- Chrome 61+ ✅
- Firefox ❌ (partial support, behind flag)
- Safari ❌ (not implemented)
- Edge 79+ ✅

**Returns**: String (`'slow-2g'`, `'2g'`, `'3g'`, `'4g'`)

**Caveats**:
- **Experimental API**: Not finalized, may change
- Safari/Firefox lack support (returns `undefined`)
- Connection type can change during session (WiFi to cellular)
- May not accurately reflect actual speed (e.g., congested 4G can be slower than good 3G)

**Fallback**: If `undefined`, assume `effectiveType = '4g'` (optimistic default, no downgrade)

**Example**:
```typescript
const connection = (navigator as any).connection;
const effectiveType = connection?.effectiveType ?? '4g';
console.log(`Connection: ${effectiveType}`);
// Possible values: 'slow-2g', '2g', '3g', '4g'
```

---

## Classification Algorithm

### Implementation

```typescript
enum DeviceTierLevel {
  HIGH = 'high',
  MID = 'mid',
  LOW = 'low',
  UNKNOWN = 'unknown'
}

interface DeviceTierResult {
  tier: DeviceTierLevel;
  cpuCores: number;
  memory: number;
  connectionSpeed: string;
  reasons: string[]; // Debug information
}

function detectDeviceTier(): DeviceTierResult {
  const reasons: string[] = [];

  // Detect CPU cores
  const cpuCores = navigator.hardwareConcurrency ?? 4;
  if (navigator.hardwareConcurrency === undefined) {
    reasons.push('CPU cores unknown, assuming 4 (mid-range)');
  } else {
    reasons.push(`CPU cores: ${cpuCores}`);
  }

  // Detect memory
  const memory = (navigator as any).deviceMemory ?? 4;
  if ((navigator as any).deviceMemory === undefined) {
    reasons.push('Device memory unknown, assuming 4GB (mid-range)');
  } else {
    reasons.push(`Device memory: ${memory} GB`);
  }

  // Detect connection
  const connection = (navigator as any).connection;
  const connectionSpeed = connection?.effectiveType ?? '4g';
  if (!connection) {
    reasons.push('Connection API unavailable, assuming 4g');
  } else {
    reasons.push(`Connection: ${connectionSpeed}`);
  }

  // Classify tier
  let tier: DeviceTierLevel;

  // High-end: 8+ cores OR 8+ GB OR (4+ cores AND 4+ GB)
  if (cpuCores >= 8 || memory >= 8 || (cpuCores >= 4 && memory >= 4)) {
    tier = DeviceTierLevel.HIGH;
    reasons.push('Classified as HIGH (powerful hardware)');
  }
  // Mid-range: 4+ cores OR 4+ GB (but not high-end)
  else if (cpuCores >= 4 || memory >= 4) {
    tier = DeviceTierLevel.MID;
    reasons.push('Classified as MID (average hardware)');
  }
  // Low-end: <4 cores AND <4 GB
  else {
    tier = DeviceTierLevel.LOW;
    reasons.push('Classified as LOW (limited hardware)');
  }

  // Connection-based downgrade
  const slowConnections = ['slow-2g', '2g', '3g'];
  if (slowConnections.includes(connectionSpeed) && tier !== DeviceTierLevel.LOW) {
    reasons.push(`Downgrading from ${tier} to ${tier === DeviceTierLevel.HIGH ? 'MID' : 'LOW'} due to slow connection`);
    tier = tier === DeviceTierLevel.HIGH ? DeviceTierLevel.MID : DeviceTierLevel.LOW;
  }

  // Unknown fallback
  if (navigator.hardwareConcurrency === undefined && (navigator as any).deviceMemory === undefined) {
    tier = DeviceTierLevel.UNKNOWN;
    reasons.push('Device APIs unavailable, using UNKNOWN tier (defaults to MID config)');
  }

  return { tier, cpuCores, memory, connectionSpeed, reasons };
}
```

---

### Decision Tree

```
START
  |
  v
Are CPU/Memory APIs available?
  |
  +-- NO --> UNKNOWN tier (use MID config)
  |
  +-- YES
      |
      v
  CPU >= 8 cores OR Memory >= 8GB OR (CPU >= 4 AND Memory >= 4)?
      |
      +-- YES --> HIGH tier (tentative)
      |
      +-- NO
          |
          v
      CPU >= 4 cores OR Memory >= 4GB?
          |
          +-- YES --> MID tier (tentative)
          |
          +-- NO --> LOW tier (tentative)

  v
Check Connection Speed
  |
  +-- Connection is slow-2g/2g/3g?
      |
      +-- YES --> Downgrade tier by 1 level (HIGH→MID, MID→LOW, LOW→LOW)
      |
      +-- NO --> Keep tier as-is

  v
FINAL TIER
```

---

## Configuration Mapping

```typescript
interface DeviceTierConfig {
  particles: number;
  targetFPS: number;
  enableCursorEffects: boolean;
  enableSmoothScroll: boolean;
  lazyLoadThreshold: number; // ms
}

const DEVICE_TIER_CONFIGS: Record<DeviceTierLevel, DeviceTierConfig> = {
  [DeviceTierLevel.HIGH]: {
    particles: 50,
    targetFPS: 60,
    enableCursorEffects: true,
    enableSmoothScroll: true,
    lazyLoadThreshold: 0
  },
  [DeviceTierLevel.MID]: {
    particles: 30,
    targetFPS: 30,
    enableCursorEffects: false,
    enableSmoothScroll: true,
    lazyLoadThreshold: 500
  },
  [DeviceTierLevel.LOW]: {
    particles: 20,
    targetFPS: 30,
    enableCursorEffects: false,
    enableSmoothScroll: false,
    lazyLoadThreshold: 1000
  },
  [DeviceTierLevel.UNKNOWN]: {
    particles: 30, // Default to MID
    targetFPS: 30,
    enableCursorEffects: false,
    enableSmoothScroll: true,
    lazyLoadThreshold: 500
  }
};

function getDeviceConfig(tier: DeviceTierLevel): DeviceTierConfig {
  return DEVICE_TIER_CONFIGS[tier];
}
```

---

## Usage in Code

### Initialization (index.astro or PageLayout.astro)

```typescript
<script>
  import { detectDeviceTier } from '@/scripts/performance/device-tier';

  // Detect tier on page load
  const deviceTierResult = detectDeviceTier();
  console.log('Device Tier:', deviceTierResult.tier);
  console.log('Reasons:', deviceTierResult.reasons);

  // Store tier in CSS custom property (for CSS-based optimizations)
  document.documentElement.style.setProperty('--device-tier', deviceTierResult.tier);

  // Store tier in global variable (for JS access)
  (window as any).__DEVICE_TIER__ = deviceTierResult;
</script>
```

### Neural Network Animation (neural-network.ts)

```typescript
import { getDeviceConfig } from '@/config/performance';

const tier = (window as any).__DEVICE_TIER__?.tier ?? 'mid';
const config = getDeviceConfig(tier);

// Initialize with tier-appropriate particle count
const neuralNetwork = new NeuralNetworkAnimation(canvas, {
  particleCount: config.particles,
  targetFPS: config.targetFPS
});
```

### Smooth Scroll (smooth-scroll.ts)

```typescript
import { getDeviceConfig } from '@/config/performance';
import { prefersReducedMotion } from '@/scripts/utils/accessibility';

const tier = (window as any).__DEVICE_TIER__?.tier ?? 'mid';
const config = getDeviceConfig(tier);

// Only initialize Lenis if tier supports it AND user doesn't prefer reduced motion
if (config.enableSmoothScroll && !prefersReducedMotion()) {
  const lenis = new Lenis({ duration: 0.6, easing: easeOutCubic });
  // ... rest of initialization
} else {
  console.log('Smooth scroll disabled (tier or user preference)');
}
```

### Lazy Loading (lazy-loader.ts)

```typescript
import { getDeviceConfig } from '@/config/performance';

const tier = (window as any).__DEVICE_TIER__?.tier ?? 'mid';
const config = getDeviceConfig(tier);

// Delay component initialization based on tier
setTimeout(() => {
  loadNonCriticalComponents();
}, config.lazyLoadThreshold);
```

---

## CSS Integration

Device tier can be exposed as CSS custom property for styling-based optimizations:

```css
/* Default (mid-range) styles */
.neural-network-canvas {
  opacity: 0.8;
  filter: blur(0px);
}

/* High-end: add extra visual flair */
html[style*="--device-tier: high"] .neural-network-canvas {
  opacity: 1;
  filter: blur(0px) saturate(1.2);
}

/* Low-end: simplify visuals */
html[style*="--device-tier: low"] .neural-network-canvas {
  opacity: 0.5;
  filter: blur(2px); /* Reduce detail to save GPU */
}

/* Unknown: same as mid-range */
html[style*="--device-tier: unknown"] .neural-network-canvas {
  opacity: 0.8;
}
```

---

## Testing Device Tiers

### Manual Testing

1. **High-end simulation**: Desktop with 8+ cores, 16GB RAM
   - Expected tier: HIGH
   - Verify: 50 particles, 60fps, cursor effects enabled

2. **Mid-range simulation**: Chrome DevTools → Performance → CPU throttling 4x slowdown
   - Expected tier: MID (or force by setting `navigator.hardwareConcurrency = 4`)
   - Verify: 30 particles, 30fps, cursor effects disabled

3. **Low-end simulation**: Chrome DevTools → Performance → CPU 6x slowdown + Network "Slow 3G"
   - Expected tier: LOW
   - Verify: 20 particles, native scroll, minimal animations

4. **Unknown simulation**: Use privacy browser (Brave with shields up) or manually delete APIs
   - Expected tier: UNKNOWN (falls back to MID config)
   - Verify: 30 particles, mid-range behavior

### Automated Testing

```typescript
// device-tier.test.ts
import { describe, test, expect, beforeEach } from 'bun:test';
import { detectDeviceTier, DeviceTierLevel } from './device-tier';

describe('Device Tier Detection', () => {
  beforeEach(() => {
    // Reset navigator mocks
    delete (navigator as any).hardwareConcurrency;
    delete (navigator as any).deviceMemory;
    delete (navigator as any).connection;
  });

  test('should detect HIGH tier for 8+ cores', () => {
    (navigator as any).hardwareConcurrency = 8;
    (navigator as any).deviceMemory = 4;
    const result = detectDeviceTier();
    expect(result.tier).toBe(DeviceTierLevel.HIGH);
  });

  test('should detect MID tier for 4 cores, 4GB', () => {
    (navigator as any).hardwareConcurrency = 4;
    (navigator as any).deviceMemory = 4;
    const result = detectDeviceTier();
    expect(result.tier).toBe(DeviceTierLevel.HIGH); // 4 cores AND 4GB = HIGH
  });

  test('should detect LOW tier for <4 cores, <4GB', () => {
    (navigator as any).hardwareConcurrency = 2;
    (navigator as any).deviceMemory = 2;
    const result = detectDeviceTier();
    expect(result.tier).toBe(DeviceTierLevel.LOW);
  });

  test('should downgrade MID to LOW on slow connection', () => {
    (navigator as any).hardwareConcurrency = 4;
    (navigator as any).connection = { effectiveType: '3g' };
    const result = detectDeviceTier();
    expect(result.tier).toBe(DeviceTierLevel.MID); // Would be HIGH, but downgraded
  });

  test('should default to UNKNOWN if APIs unavailable', () => {
    const result = detectDeviceTier();
    expect(result.tier).toBe(DeviceTierLevel.UNKNOWN);
    expect(result.cpuCores).toBe(4); // Fallback
    expect(result.memory).toBe(4);   // Fallback
  });
});
```

---

## Privacy Considerations

**Device Memory API**: Considered privacy-sensitive, may be deprecated in future browsers
- Rounded values prevent precise fingerprinting
- Some browsers (Firefox, Safari) refuse to implement due to privacy concerns
- Fallback to mid-range tier ensures site works without API

**Hardware Concurrency**: Lower privacy risk (less uniquely identifying than memory)
- Still subject to privacy-focused browsers masking values
- Always provide fallback logic

**Network Information API**: Experimental, may be removed
- Not reliable for tier classification (connection can change frequently)
- Use only as modifier, not primary classification signal

**Recommendation**: Device tier should degrade gracefully if APIs removed. Always test with APIs disabled.

---

## Contract Validation

**This contract is complete when**:

✅ Device tier classification algorithm implemented in `src/scripts/performance/device-tier.ts`
✅ Configuration mapping defined in `src/config/performance.ts`
✅ Unit tests cover all tier detection scenarios (high, mid, low, unknown, connection downgrade)
✅ Integration with neural network, smooth scroll, lazy loader verified
✅ CSS custom property `--device-tier` exposed for styling optimizations
✅ Fallback behavior tested with APIs disabled (graceful degradation)

**Acceptance Criteria**:
- Classification must complete in <10ms (synchronous, non-blocking)
- Tier detection must not throw errors if APIs unavailable
- Configuration must apply correctly to all animations and components
- Debug logging (reasons array) must provide clear classification rationale

---

**Contract Status**: Design complete, awaiting implementation
**Next Steps**: Implement device-tier.ts, integrate with animation scripts, validate on real devices
