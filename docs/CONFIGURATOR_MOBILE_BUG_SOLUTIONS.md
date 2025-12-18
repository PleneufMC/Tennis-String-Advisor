# Configurator Mobile Bug - Solutions Documentation

## Problem Description

**Issue**: On Chrome Mobile, when selecting an option in the configurator (e.g., "Débutant" for level), then selecting another option in a different category (e.g., "Régulier" for frequency), the first selection disappears. This prevents users from proceeding to the next step.

**Environment**: Chrome Mobile, Safari Mobile
**Page**: `/configurator.html`
**Severity**: Critical - Blocks user progression

---

## Timeline of Solutions Attempted

### Solution 1: Initial Global Scope Fix
**Commit**: `12b9614`
**Date**: First attempt
**Hypothesis**: Functions not accessible globally, causing `onclick` handlers to fail on mobile.

**Changes Made**:
```javascript
// Added explicit window assignments
window.selectOption = selectOption;
window.goToStep = goToStep;
window.restartConfigurator = restartConfigurator;

// Added DOMContentLoaded initialization
document.addEventListener('DOMContentLoaded', function() {
    goToStep(1);
});
```

**Result**: ❌ Failed - Problem persisted

---

### Solution 2: Event Listeners Instead of onclick
**Commit**: `7d8fcc2`
**Date**: Second attempt
**Hypothesis**: Inline `onclick` attributes unreliable on mobile; event listeners more robust.

**Changes Made**:
```javascript
// Replaced onclick="goToStep(2)" with:
document.getElementById('step1-next').addEventListener('click', function(e) {
    e.preventDefault();
    goToStep(2);
});
document.getElementById('step1-next').addEventListener('touchend', function(e) {
    e.preventDefault();
    goToStep(2);
});
```

**Result**: ❌ Failed - Deselection issue still occurred

---

### Solution 3: Event Listeners on Option Cards with stopPropagation
**Commit**: `4569888`
**Date**: Third attempt
**Hypothesis**: Touch events bubbling up, causing unintended deselection. Need to stop propagation.

**Changes Made**:
```javascript
// Added event listeners to all option cards
document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function(e) {
        e.stopPropagation();
        const category = this.closest('[data-category]')?.dataset.category || 
                        this.getAttribute('onclick')?.match(/selectOption\(this,\s*'(\w+)'\)/)?.[1];
        if (category) {
            selectOption(this, category);
        }
    });
    
    card.addEventListener('touchend', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // Same logic as click
    });
});
```

**Result**: ❌ Failed - Problem persisted

---

### Solution 4: Unique Group IDs + Rewritten selectOption
**Commit**: `fee2851`
**Date**: Fourth attempt (Radical Fix)
**Hypothesis**: The `selectOption` function was using `parentElement` which could reference the wrong container. Multiple grids with same classes caused cross-contamination.

**Changes Made**:

1. **Added unique IDs to each option group**:
```html
<!-- Step 1 -->
<div id="level-group" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <!-- Level options -->
</div>
<div id="frequency-group" class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <!-- Frequency options -->
</div>

<!-- Step 2 -->
<div id="style-group" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <!-- Style options -->
</div>
<div id="physical-group" class="grid grid-cols-2 md:grid-cols-3 gap-4">
    <!-- Physical problems options -->
</div>

<!-- Step 3 -->
<div id="budget-racquet-group" class="grid grid-cols-3 gap-4 mb-8">
    <!-- Racquet budget options -->
</div>
<div id="budget-string-group" class="grid grid-cols-3 gap-4">
    <!-- String budget options -->
</div>
```

2. **Rewrote selectOption to use group IDs**:
```javascript
function selectOption(element, category) {
    console.log('selectOption called:', category, element.dataset.value);
    
    // Map category to group ID
    const groupId = category + '-group';
    const groupContainer = document.getElementById(groupId);
    
    if (!groupContainer) {
        console.error('Group not found:', groupId);
        return;
    }
    
    // Only deselect within this specific group
    groupContainer.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-red-500', 'bg-red-50', 'selected');
    });
    
    // Select the clicked element
    element.classList.add('ring-2', 'ring-red-500', 'bg-red-50', 'selected');
    selections[category] = element.dataset.value;
    
    console.log('Current selections:', selections);
}
```

**Result**: ❌ Failed - Problem still persists

---

## Analysis of the Root Cause

### What We Know:
1. The bug only manifests on mobile (Chrome Mobile, possibly Safari)
2. Desktop browsers work correctly
3. Multiple selection categories exist within the same "step" container
4. Selecting in one category somehow triggers deselection in another

### Potential Remaining Causes:

1. **Touch Event Double-Firing**: Mobile browsers may fire both `touchstart`/`touchend` AND `click` events, causing the function to run twice with unexpected behavior.

2. **CSS :active/:hover States**: Mobile touch might trigger CSS states that interfere with the visual selection.

3. **Event Delegation Conflict**: There might be a parent-level event listener that's intercepting and re-processing events.

4. **Cached JavaScript**: Despite cache clearing, service workers or aggressive caching might serve old code.

5. **Multiple onclick Handlers**: Both inline `onclick` and `addEventListener` might be attached, causing double execution.

6. **Viewport/Touch Issues**: The touch target might be registering on the wrong element due to mobile viewport scaling.

---

## Files Modified

- `/home/user/webapp/public/configurator.html`

## Related PR

- **PR #1**: https://github.com/PleneufMC/Tennis-String-Advisor/pull/1

## Commits Related to This Bug

1. `12b9614` - fix(configurator): Fix 'Suivant' button not working on mobile
2. `7d8fcc2` - fix(configurator): Enhanced mobile button fix with event listeners
3. `4569888` - fix(configurator): Fix option cards deselection bug on mobile
4. `fee2851` - fix(configurator): RADICAL FIX - Add unique IDs to option groups

---

---

### Solution 5: Complete Rewrite - Data Attributes + Single Event Handler
**Commit**: (pending)
**Date**: Current attempt
**Hypothesis**: The root cause is the conflict between `onclick` inline attributes AND `addEventListener` for both `click` and `touchend` events. On mobile, a single touch can trigger:
1. `touchend` event
2. Synthesized `click` event
3. `onclick` attribute execution

This triple-firing causes unpredictable behavior.

**Changes Made**:

1. **Removed ALL onclick attributes from HTML** - Cards now use `data-category` attribute:
```html
<!-- BEFORE -->
<div class="option-card" data-value="debutant" onclick="selectOption(this, 'level')">

<!-- AFTER -->
<div class="option-card" data-value="debutant" data-category="level">
```

2. **CSS improvements for touch**:
```css
.option-card { 
  touch-action: manipulation;  /* Prevents 300ms delay, double-tap zoom */
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  cursor: pointer;
}
.option-card:active { transform: scale(0.98); }  /* Visual feedback */
.option-card.selected { /* !important to override inline styles */ }
```

3. **Single event handler approach** - Only `click` events, no `touchend`:
```javascript
document.querySelectorAll('.option-card').forEach(card => {
  const category = card.dataset.category;
  
  // ONLY click - browser synthesizes click after touch automatically
  card.addEventListener('click', function(e) {
    e.stopPropagation();
    selectOption(this, category);
  }, { passive: false });
});
```

4. **Key insight**: Modern mobile browsers automatically fire a `click` event ~300ms after `touchend`. With `touch-action: manipulation` CSS, this delay is removed. Using ONLY `click` means:
   - Desktop: click works normally
   - Mobile: touch → (no delay) → synthetic click → handler fires ONCE

**Why Previous Solutions Failed**:
- Having both `onclick` attributes AND `addEventListener('click')` caused double-firing
- Adding `touchend` listeners caused triple-firing
- Mobile browsers were inconsistent about which handler fired first

**Expected Result**: ✅ Should work - single handler, no conflicts

---

---

### Solution 6: Event Delegation + Explicit State Management
**Commit**: (pending)
**Date**: Current attempt
**Hypothesis**: Even with data-category attributes, attaching individual event listeners to each card might cause issues. Use EVENT DELEGATION instead - ONE listener on document.body.

**Changes Made**:

1. **Track selected cards by reference** (not just by class):
```javascript
const selectedCards = {
  'level': null,
  'frequency': null,
  // ... etc
};
```

2. **New handleCardSelection function**:
```javascript
function handleCardSelection(card) {
  const category = card.dataset.category;
  
  // Deselect previous card in this category (if any)
  const previousCard = selectedCards[category];
  if (previousCard && previousCard !== card) {
    previousCard.classList.remove('selected');
  }
  
  // Select new card
  card.classList.add('selected');
  selectedCards[category] = card;
  selections[category] = card.dataset.value;
}
```

3. **Single delegated event listener on body**:
```javascript
document.body.addEventListener('click', function(e) {
  const card = e.target.closest('.option-card');
  if (card && card.dataset.category) {
    handleCardSelection(card);
  }
});
```

**Why This Should Work**:
- Only ONE event listener exists (on body)
- No per-card listeners = no possibility of multiple handlers firing
- `closest('.option-card')` finds the card even if user clicks on child element
- Explicit tracking of selected card by reference (not querySelectorAll)
- Deselects only the previous card in same category, nothing else

---

## Summary of All Approaches

| Solution | Approach | Result |
|----------|----------|--------|
| 1 | Global scope + DOMContentLoaded | ❌ Failed |
| 2 | addEventListener for nav buttons | ❌ Failed |
| 3 | stopPropagation on touch events | ❌ Failed |
| 4 | Unique group IDs | ❌ Failed |
| 5 | data-category + single click handler + CSS | ❌ Failed |
| 6 | **Event Delegation + Explicit State** | ⏳ Testing |

## Key Learnings

1. **Never mix onclick attributes with addEventListener for the same element**
2. **On mobile, touchend and click can both fire for the same interaction**
3. **touch-action: manipulation is essential for responsive touch UX**
4. **data-attributes are cleaner than parsing onclick strings**
5. **The browser's synthetic click event after touch is sufficient - no need for touchend handlers**
6. **Event delegation (single listener on body) is the most reliable approach**
7. **Track selected elements by reference, not by querying the DOM**
