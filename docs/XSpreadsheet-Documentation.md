# x-spreadsheet Documentation

A comprehensive, enterprise-grade web-based spreadsheet component built with HTML5 Canvas. Provides a complete Excel-like editing experience in the browser with support for formulas, formatting, cell merging, data validation, auto-filtering, freeze panes, and comprehensive keyboard shortcuts.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Core Architecture](#core-architecture)
5. [Component System](#component-system)
6. [Features Detailed](#features-detailed)
7. [Configuration Options](#configuration-options)
8. [API Reference](#api-reference)
9. [Events System](#events-system)
10. [Data Structure](#data-structure)
11. [Formulas Reference](#formulas-reference)
12. [Cell Formatting](#cell-formatting)
13. [Data Validation](#data-validation)
14. [Keyboard Shortcuts](#keyboard-shortcuts)
15. [Toolbars Reference](#toolbars-reference)
16. [Context Menu Reference](#context-menu-reference)
17. [Auto-Filter System](#auto-filter-system)
18. [Freeze Panes](#freeze-panes)
19. [Style Management](#style-management)
20. [Undo/Redo System](#undoredo-system)
21. [Clipboard Operations](#clipboard-operations)
22. [Internationalization](#internationalization)
23. [Rendering System](#rendering-system)
24. [Performance Optimization](#performance-optimization)
25. [Common Patterns](#common-patterns)
26. [Troubleshooting](#troubleshooting)

---

## Introduction

x-spreadsheet is a client-side JavaScript library that renders a fully functional spreadsheet interface using HTML5 Canvas. Unlike DOM-based approaches, Canvas rendering provides superior performance for large datasets and complex styling operations.

### Key Capabilities

- **Canvas-based rendering**: High-performance 2D rendering with device pixel ratio support
- **Excel-compatible features**: Formulas, cell merging, freeze panes, auto-filter, data validation
- **Full keyboard support**: Comprehensive keyboard shortcuts for efficient editing
- **Multi-sheet support**: Create and manage multiple worksheets within a single instance
- **Rich formatting**: Text styling, cell borders, number formats, alignment options
- **Data validation**: Built-in validators for list, number, date, email, phone
- **Undo/Redo**: Complete history management with unlimited undo/redo
- **Customization**: Extend toolbar with custom buttons and actions

### Version Compatibility

| Version | Status | Notes |
|---------|--------|-------|
| 1.0.x | Stable | Current stable release |
| 1.1.x | Beta | Latest beta with enhanced features |

---

## Installation

### npm Installation

```bash
npm install x-data-spreadsheet
```

### CDN Installation

#### unpkg CDN (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>x-spreadsheet Demo</title>
  <link rel="stylesheet" href="https://unpkg.com/x-data-spreadsheet@1.0.20/dist/xspreadsheet.css">
</head>
<body>
  <div id="spreadsheet"></div>
  <script src="https://unpkg.com/x-data-spreadsheet@1.0.20/dist/xspreadsheet.js"></script>
</body>
</html>
```

### Local Development

```bash
git clone https://github.com/myliang/x-spreadsheet.git
cd x-spreadsheet
npm install
npm run dev
```

---

## Quick Start

### Basic Spreadsheet Creation

```javascript
import Spreadsheet from 'x-data-spreadsheet';

// Create spreadsheet instance
const spreadsheet = Spreadsheet('#spreadsheet-container', {
  showToolbar: true,
  showGrid: true,
  showBottomBar: true
});

// Load initial data
spreadsheet.loadData([{
  name: 'Sheet1',
  rows: {
    1: {
      cells: {
        0: { text: 'Product' },
        1: { text: 'Price' },
        2: { text: 'Quantity' }
      }
    },
    2: {
      cells: {
        0: { text: 'Widget A' },
        1: { text: 100 },
        2: { text: 50 }
      }
    }
  }
}]);
```

### Complete Example with Custom Toolbar

```javascript
const spreadsheet = Spreadsheet('#container', {
  showToolbar: true,
  showGrid: true,
  showBottomBar: true,
  extendToolbar: {
    left: [
      {
        tip: 'Save',
        icon: 'data:image/svg+xml;base64,...',
        onClick: (data, sheet) => {
          console.log('Save clicked:', data);
        }
      }
    ],
    right: [
      {
        tip: 'Export',
        el: document.createElement('button'),
        onClick: (data, sheet) => {
          console.log('Export data:', data);
        }
      }
    ]
  }
});

// Listen for changes
spreadsheet.change((data) => {
  console.log('Data changed:', JSON.stringify(data));
});
```

### Read-Only Mode

```javascript
const spreadsheet = Spreadsheet('#container', {
  mode: 'read',
  showToolbar: false,
  showGrid: true,
  showBottomBar: false
});
```

---

## Core Architecture

### MVC Architecture Pattern

x-spreadsheet implements a Model-View-Controller (MVC) architecture specifically designed for canvas-based spreadsheet rendering:

```
┌─────────────────────────────────────────────────────────────────┐
│                       Spreadsheet                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     CONTROLLER                             │   │
│  │  - Event handling (keyboard, mouse, touch)                  │   │
│  │  - User input processing                                  │   │
│  │  - Command routing                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┴─────────────────────────────┐   │
│  │                         MODEL                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │ DataProxy  │  │   History   │  │    Selector    │  │   │
│  │  │  - cells   │  │ - undo stack │  │ - selection   │  │   │
│  │  │  - rows   │  │ - redo stack │  │ - focus       │  │   │
│  │  │  - cols  │  │              │  └─────────────────┘  │   │
│  │  │  - styles│  │              │                         │   │
│  │  │  - merges│  │              │                         │   │
│  │  └─────────────┘  └─────────────┘                         │   │
│  └───────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┴─────────────────────────────┐   │
│  │                          VIEW                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │   Sheet    │  │  Toolbar   │  │   Bottombar    │  │   │
│  │  │  - canvas  │  │  - buttons│  │  - tabs       │  │   │
│  │  │  - grid   │  │  - menus  │  │  - add button │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └───────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → Event Handler → Command Processor → DataProxy
                                    ↓
                              History (undo)
                                    ↓
                              Change Event → View Update → Canvas Render
```

---

## Component System

### Component Hierarchy

```
Spreadsheet
├── Root Element (div.x-spreadsheet)
│   ├── Toolbar (div.x-spreadsheet-toolbar)
│   │   ├── Undo/Redo
│   │   ├── Print
│   │   ├── Paint Format
│   │   ├── Clear Format
│   │   ├── Format
│   │   ├── Font/Font Size
│   │   ├── Text Style (Bold, Italic, Underline, Strike)
│   │   ├── Colors (Text, Fill)
│   │   ├── Border
│   │   ├── Merge
│   │   ├── Alignment (Horizontal, Vertical)
│   │   ├── Text Wrap
│   │   ├── Freeze
│   │   ├── Autofilter
│   │   ├── Formula
│   │   └── More dropdown
│   ├── Sheet Container (div.x-spreadsheet-table)
│   │   ├── Column Headers
│   │   ├── Row Headers
│   │   ├── Canvas (main editor)
│   │   ├── Scrollbar X
│   │   ├── Scrollbar Y
│   │   ├── Editor (textarea overlay)
│   │   ├── Selector (selection highlights)
│   │   └── Context Menu
│   └── Bottombar (div.x-spreadsheet-bottombar)
│       ├── Sheet Tabs
│       └── Add Sheet Button
```

### Component Responsibilities

#### DataProxy (Model)

The DataProxy class is the core data model that manages all spreadsheet data:

```javascript
// Located in: src/core/data_proxy.js
class DataProxy {
  constructor(name, settings) {
    this.name = name || 'sheet';
    this.freeze = [0, 0];           // [row, col] freeze position
    this.styles = [];              // Style definitions array
    this.merges = new Merges();    // Merged cell ranges
    this.rows = new Rows();        // Row data
    this.cols = new Cols();        // Column data
    this.validations = new Validations();
    this.hyperlinks = {};
    this.comments = {};
    
    // Runtime only (not persisted)
    this.selector = new Selector();
    this.scroll = new Scroll();
    this.history = new History();
    this.clipboard = new Clipboard();
    this.autoFilter = new AutoFilter();
  }
}
```

#### Sheet (View)

The Sheet component handles all Canvas rendering:

```javascript
// Located in: src/component/sheet.js
class Sheet {
  constructor(rootEl, data) {
    this.data = data;
    this.el = rootEl;
    this.table = new Table(rootEl, data);
    this.toolbar = new Toolbar(data, ...);
    this.contextmenu = new ContextMenu(...);
    this.editor = new Editor(data, ...);
  }
}
```

---

## Features Detailed

### 1. Cell Editing System

The cell editing system supports multiple input modes:

#### Direct Edit Mode

Click on a cell to select it, then start typing to edit:

```javascript
// Cell selection triggers:
element.on('dblclick', () => {
  this.data.selector.set(ri, ci);
  this.editor.show();
});
```

#### Formula Input

Formulas are automatically detected when text starts with `=`:

```javascript
// Example formulas
=SUM(A1:A10)
=AVERAGE(B2:B5)
=IF(A1>100, "High", "Low")
```

#### Multi-line Text

Press Alt+Enter to insert a line break within a cell:

```javascript
// Multi-line support in editor.js
if (keyCode === 13 && altKey) {
  insertText('\n');
}
```

### 2. Selection System

The selector manages cell and range selection state:

```javascript
// Located in: src/core/selector.js
class Selector {
  constructor() {
    this.ri = 0;          // Row index
    this.ci = 0;         // Column index
    this.rn = 1;         // Row count
    this.cn = 1;         // Column count
    this.range = new CellRange(0, 0, 0, 0);
    this.multiple = false;
    this.active = false;
  }
}
```

#### Selection Types

| Type | Description | Trigger |
|------|-------------|----------|
| Single | One cell | Click |
| Range | Multiple cells | Shift+Click or Drag |
| Row | Entire row | Click row header |
| Column | Entire column | Click column header |
| All | Entire sheet | Ctrl+A |

### 3. Rendering System

The Canvas rendering system uses device pixel ratio for crisp rendering:

```javascript
// Located in: src/canvas/draw.js
class Draw {
  constructor(el, width, height) {
    this.ctx = el.getContext('2d');
    this.ctx.scale(dpr(), dpr());  // Device pixel ratio
  }
}
```

#### Render Layers

1. **Background layer**: Cell backgrounds, grid lines
2. **Content layer**: Cell text, formulas, numbers
3. **Border layer**: Cell borders, merged cell borders
4. **Selection layer**: Selection highlights, active cell
5. **Editor overlay**: Inline text editor

---

## Configuration Options

### Complete Options Reference

```javascript
const options = {
  // ==================== DISPLAY OPTIONS ====================
  
  // Mode: 'edit' for full editing, 'read' for read-only
  mode: 'edit',
  
  // Show/hide main toolbar
  showToolbar: true,
  
  // Show/hide grid lines
  showGrid: true,
  
  // Show/hide right-click context menu
  showContextmenu: true,
  
  // Show/hide bottom sheet tabs
  showBottomBar: true,
  
  // ==================== FOCUS OPTIONS ====================
  
  // Auto-focus on initialization
  autoFocus: true,
  
  // ==================== CUSTOM TOOLBAR ====================
  
  // Add custom buttons to toolbar
  extendToolbar: {
    left: [
      {
        tip: 'Custom Button',
        icon: 'url/to/icon.png',
        onClick: (data, sheet) => {
          // Custom action
        }
      }
    ],
    right: []
  },
  
  // ==================== VIEW DIMENSIONS ====================
  
  // Custom view dimensions
  view: {
    height: () => window.innerHeight - 100,
    width: () => window.innerWidth - 50
  },
  
  // ==================== ROW CONFIGURATION ====================
  
  row: {
    // Default number of rows
    len: 100,
    // Default row height in pixels
    height: 25
  },
  
  // ==================== COLUMN CONFIGURATION ====================
  
  col: {
    // Default number of columns (A-Z = 26, A-XX = 100+)
    len: 26,
    // Default column width in pixels
    width: 100,
    // Row number column width
    indexWidth: 60,
    // Minimum column width
    minWidth: 60
  },
  
  // ==================== DEFAULT STYLE ====================
  
  style: {
    // Default background color
    bgcolor: '#ffffff',
    // Default horizontal alignment
    align: 'left',
    // Default vertical alignment
    valign: 'middle',
    // Default text wrap
    textwrap: false,
    // Default strikethrough
    strike: false,
    // Default underline
    underline: false,
    // Default text color
    color: '#0a0a0a',
    // Default font settings
    font: {
      name: 'Arial',
      size: 10,
      bold: false,
      italic: false
    },
    // Default number format
    format: 'normal'
  }
};
```

### Default Values Summary

| Option | Default | Type | Description |
|--------|---------|------|-------------|
| `mode` | `'edit'` | String | Editing mode: 'edit' or 'read' |
| `showToolbar` | `true` | Boolean | Display formatting toolbar |
| `showGrid` | `true` | Boolean | Display grid lines |
| `showContextmenu` | `true` | Boolean | Display context menu |
| `showBottomBar` | `true` | Boolean | Display sheet tabs |
| `autoFocus` | `true` | Boolean | Auto-focus on init |
| `row.len` | `100` | Number | Initial number of rows |
| `row.height` | `25` | Number | Default row height |
| `col.len` | `26` | Number | Initial number of columns |
| `col.width` | `100` | Number | Default column width |
| `col.indexWidth` | `60` | Number | Row header width |
| `col.minWidth` | `60` | Number | Minimum column width |

---

## API Reference

### Class: Spreadsheet

#### Constructor

```javascript
new Spreadsheet(container, options)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| container | String/HTMLElement | Yes | CSS selector or DOM element |
| options | Object | No | Configuration options |

**Returns:** Spreadsheet instance

#### Methods

##### loadData(data)

Load spreadsheet data from JSON array.

```javascript
spreadsheet.loadData([
  {
    name: 'Sheet1',
    freeze: 'B3',
    styles: [...],
    merges: [...],
    rows: {...},
    cols: {...}
  }
])
```

**Parameters:**
- `data` (Array|Object): Single sheet or array of sheets

**Returns:** Spreadsheet instance (chainable)

---

##### getData()

Get current spreadsheet data as JSON.

```javascript
const data = spreadsheet.getData();
// Returns:
// [
//   {
//     name: "Sheet1",
//     freeze: "B3",
//     styles: [...],
//     merges: [...],
//     rows: {...},
//     cols: {...}
//   }
// ]
```

**Returns:** Array of sheet data objects

---

##### cellText(rowIndex, colIndex, text, sheetIndex)

Set cell text content.

```javascript
// Set cell at row 0, column 0
spreadsheet.cellText(0, 0, 'Hello');

// Set cell with sheet index
spreadsheet.cellText(0, 0, 'World', 1);
```

**Parameters:**
- `rowIndex` (Number): Row index (0-based)
- `colIndex` (Number): Column index (0-based)
- `text` (String): Cell text content
- `sheetIndex` (Number): Sheet index (optional, default: 0)

**Returns:** Spreadsheet instance (chainable)

---

##### cell(rowIndex, colIndex, sheetIndex)

Get cell data including text and style.

```javascript
const cell = spreadsheet.cell(0, 0);
// Returns: { text: "Hello", style: 0, merge: null }
```

**Parameters:**
- `rowIndex` (Number): Row index (0-based)
- `colIndex` (Number): Column index (0-based)
- `sheetIndex` (Number): Sheet index (optional)

**Returns:** Cell object or null

---

##### cellStyle(rowIndex, colIndex, sheetIndex)

Get cell style definition.

```javascript
const style = spreadsheet.cellStyle(0, 0);
// Returns: { color: "#000000", bgcolor: "#ffffff", align: "left", ... }
```

**Parameters:**
- `rowIndex` (Number): Row index (0-based)
- `colIndex` (Number): Column index (0-based)
- `sheetIndex` (Number): Sheet index (optional)

**Returns:** Style object or null

---

##### reRender()

Force complete re-render of the spreadsheet.

```javascript
// Update cell data directly
cell.text = 'Updated';
// Force re-render
spreadsheet.reRender();
```

**Returns:** Spreadsheet instance (chainable)

---

##### deleteSheet()

Delete the currently active sheet.

```javascript
// Delete current sheet
spreadsheet.deleteSheet();
```

**Returns:** void

---

### Event System

#### on(eventName, callback)

Bind event handler to spreadsheet events.

```javascript
// Cell selection event
spreadsheet.on('cell-selected', (cell, ri, ci) => {
  console.log('Cell selected:', { ri, ci, cell });
});

// Multiple cells selection
spreadsheet.on('cells-selected', (cell, { sri, sci, eri, eci }) => {
  console.log('Range selected:', { sri, sci, eri, eci });
});

// Cell editing event
spreadsheet.on('cell-edited', (text, ri, ci) => {
  console.log('Cell edited:', { ri, ci, text });
});
```

#### change(callback)

Bind handler to any data change event (shorthand).

```javascript
// Watch for all data changes
spreadsheet.change((data) => {
  console.log('Data changed:', JSON.stringify(data));
});
```

### Static Methods

#### Spreadsheet.locale(lang, messages)

Set localization for custom language.

```javascript
// Switch to Chinese
x_spreadsheet.locale('zh-cn');

// Use custom messages
x_spreadsheet.locale('custom', {
  toolbar: {
    undo: 'Undo',
    redo: 'Redo',
    // ...
  },
  contextmenu: {
    copy: 'Copy',
    paste: 'Paste',
    // ...
  }
});
```

---

## Events System

### Available Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `cell-selected` | `(cell, ri, ci)` | Single cell is selected |
| `cells-selected` | `(cell, {sri, sci, eri, eci})` | Range of cells selected |
| `cell-edited` | `(text, ri, ci)` | Cell content was edited |
| `change` | `(data)` | Any data modification occurred |

### Event Handling Examples

```javascript
// Cell selection handler
spreadsheet.on('cell-selected', (cell, ri, ci) => {
  const column = String.fromCharCode(65 + ci);  // Convert to letter
  const row = ri + 1;
  console.log(`Selected ${column}${row}:`, cell);
});

// Multiple selection handler
spreadsheet.on('cells-selected', (cell, range) => {
  console.log(`Selected range: ${range.sri}:${range.sci} to ${range.eri}:${range.eci}`);
});

// Edit handler
spreadsheet.on('cell-edited', (text, ri, ci) => {
  console.log(`Edited cell ${ri},${ci}: "${text}"`);
});

// Data change watcher
spreadsheet.change((data) => {
  // Auto-save functionality
  localStorage.setItem('spreadsheet-data', JSON.stringify(data));
});
```

---

## Data Structure

### Complete Sheet Data Format

```javascript
{
  // Sheet name
  name: 'Sheet1',
  
  // Freeze position (cell reference like 'B3')
  freeze: 'B3',
  
  // Array of style definitions
  styles: [
    {
      bgcolor: '#ffffff',     // Background color
      align: 'left',          // Horizontal alignment
      valign: 'middle',      // Vertical alignment
      textwrap: false,       // Text wrap enabled
      strike: false,         // Strikethrough
      underline: false,      // Underline
      color: '#0a0a0a',      // Text color (hex)
      font: {
        name: 'Arial',      // Font family
        size: 10,           // Font size (points)
        bold: false,        // Bold
        italic: false       // Italic
      },
      border: {
        top: ['thin', '#000000'],
        bottom: ['thin', '#000000'],
        left: ['thin', '#000000'],
        right: ['thin', '#000000']
      },
      format: 'normal'      // Number format
    }
  ],
  
  // Array of merged cell ranges
  merges: ['A1:C2', 'D5:E5'],
  
  // Row data (sparse object)
  rows: {
    // Total row count
    len: 100,
    
    // Row 1 (1-indexed in notation)
    1: {
      // Custom row height
      height: 30,
      // Style index for entire row
      style: 0,
      // Cell data for this row
      cells: {
        // Column 0 (A)
        0: {
          // Cell text content
          text: 'Value',
          // Style index reference
          style: 0,
          // Merge info [rows, cols]
          merge: [0, 0]
        },
        // Column 1 (B)
        1: {
          text: '100',
          style: 0
        }
      }
    },
    
    // Row 2
    2: {
      cells: {
        0: { text: 'Widget' },
        1: { text: 50 }
      }
    }
  },
  
  // Column data
  cols: {
    // Total column count
    len: 26,
    
    // Custom widths (column index as key)
    2: { width: 200 }
  }
}
```

### Cell Data Object

```javascript
{
  text: 'Cell content',      // Required: Cell text
  style: 0,                // Optional: Style index in styles array
  merge: [2, 1]           // Optional: [row span, col span]
}
```

### Style Definition

```javascript
{
  // ==================== ALIGNMENT ====================
  align: 'left',           // 'left' | 'center' | 'right'
  valign: 'middle',       // 'top' | 'middle' | 'bottom'
  
  // ==================== TEXT STYLE ====================
  bold: false,            // Bold text
  italic: false,          // Italic text
  underline: false,      // Underlined text
  strike: false,        // Strikethrough text
  textwrap: false,      // Wrap text in cell
  
  // ==================== COLORS ====================
  color: '#0a0a0a',      // Text color (hex)
  bgcolor: '#ffffff',    // Background color (hex)
  
  // ==================== FONT ====================
  font: {
    name: 'Arial',       // Font family name
    size: 10,          // Font size in points
    bold: false,        // Font weight bold
    italic: false      // Font style italic
  },
  
  // ==================== BORDERS ====================
  border: {
    top: ['thin', '#000000'],    // [style, color]
    bottom: ['thin', '#000000'],
    left: ['thin', '#000000'],
    right: ['thin', '#000000']
  },
  
  // ==================== FORMAT ====================
  format: 'normal'        // Number format type
}
```

### Border Format

Each border is defined as: `[style, color]`

**Available Border Styles:**

| Style | Description | Visual Weight |
|-------|-------------|---------------|
| `'thin'` | Thin line | 1px |
| `'medium'` | Medium line | 2px |
| `'thick'` | Thick line | 3px |
| `'dashed'` | Dashed line | - |
| `'dotted'` | Dotted line | - |

### Number Format Types

| Format | Example Input | Example Output |
|--------|--------------|---------------|
| `'normal'` | 1234.567 | 1234.567 |
| `'text'` | 00123 | 00123 (preserved) |
| `'number'` | 1234.567 | 1,234.57 |
| `'percent'` | 0.25 | 25% |
| `'rmb'` | 1234.567 | ¥1,234.57 |
| `'usd'` | 1234.567 | $1,234.57 |
| `'eur'` | 1234.567 | €1,234.57 |
| `'date'` | 44562 | 2022-01-01 |
| `'time'` | 0.5 | 12:00 PM |
| `'datetime'` | 44562.5 | 2022-01-01 12:00 |
| `'duration'` | 100 | 00:01:40 |

---

## Formulas Reference

### Built-in Formulas

The spreadsheet supports the following formulas:

#### Mathematical Functions

| Function | Syntax | Description |
|----------|--------|-------------|
| SUM | `=SUM(range)` | Sum of all values in range |
| AVERAGE | `=AVERAGE(range)` | Average of all values |
| MAX | `=MAX(range)` | Maximum value |
| MIN | `=MIN(range)` | Minimum value |
| COUNT | `=COUNT(range)` | Count numeric values |
| COUNTA | `=COUNTA(range)` | Count non-empty cells |

#### Logical Functions

| Function | Syntax | Description |
|----------|--------|-------------|
| IF | `=IF(condition, trueValue, falseValue)` | Conditional evaluation |
| AND | `=AND(cond1, cond2, ...)` | Returns true if all conditions are true |
| OR | `=OR(cond1, cond2, ...)` | Returns true if any condition is true |

#### Text Functions

| Function | Syntax | Description |
|----------|--------|-------------|
| CONCAT | `=CONCAT(text1, text2, ...)` | Concatenate text values |

### Formula Examples

```javascript
// Basic arithmetic
=SUM(A1:A10)              // Sum A1 through A10
=AVERAGE(B2:B5)           // Average B2 through B5
=MAX(C1:C100)             // Maximum value in range
=MIN(D1:D50)             // Minimum value in range

// Conditional
=IF(A1>10, "Yes", "No")  // If A1 > 10, return "Yes"
=IF(A1="Active", 1, 0)   // Check cell value

// Multiple conditions
=AND(A1>0, B1>0)         // Both A1 and B1 are positive
=OR(A1="Yes", B1="Yes")  // Either A1 or B1 equals "Yes"

// Text
=CONCAT(A1, " ", B1)     // Concatenate with space
=CONCAT(FirstName, " ", LastName)

// Complex formulas
=SUM(A1:A10, C1:C10)    // Multiple ranges
=AVERAGE(IF(A1>0, A1, 0)) // Conditional average
```

### Cell References

| Reference Type | Example | Description |
|----------------|---------|-------------|
| Relative | A1 | Changes when copied |
| Absolute | $A$1 | Fixed when copied |
| Mixed Row | A$1 | Fixed row when copied |
| Mixed Column | $A1 | Fixed column when copied |

### Range Notation

| Range | Description |
|-------|-------------|
| A1:B10 | Continuous range |
| A:A | Entire column |
| 1:1 | Entire row |
| A1:D4, F1:G4 | Multiple ranges |

### Formula Errors

| Error | Description |
|-------|-------------|
| `#REF!` | Invalid cell reference |
| `#NAME?` | Unknown function name |
| `#VALUE!` | Invalid value type |
| `#DIV/0!` | Division by zero |
| `#N/A` | Value not available |

---

## Cell Formatting

### Text Formatting Properties

#### Horizontal Alignment

```javascript
{ align: 'left' | 'center' | 'right' }
```

| Value | Description |
|-------|-------------|
| `'left'` | Left aligned |
| `'center'` | Center aligned |
| `'right'` | Right aligned |

#### Vertical Alignment

```javascript
{ valign: 'top' | 'middle' | 'bottom' }
```

| Value | Description |
|-------|-------------|
| `'top'` | Top aligned |
| `'middle'` | Vertically centered |
| `'bottom'` | Bottom aligned |

#### Font Settings

```javascript
{
  font: {
    name: 'Arial',    // Font family
    size: 10,        // Font size (8-72)
    bold: true,       // Bold
    italic: true     // Italic
  }
}
```

#### Available Fonts

| Font Name | Platform |
|----------|----------|
| Arial | All |
| Helvetica | Mac/Windows |
| Times New Roman | All |
| Courier New | All |
| Georgia | All |
| Verdana | All |
| Tahoma | Windows |
| Trebuchet MS | All |
| Comic Sans MS | All |

#### Text Decorations

```javascript
{
  underline: true/false,
  strike: true/false,
  textwrap: true/false
}
```

| Property | Description | Shortcut |
|----------|-------------|----------|
| `underline` | Underlined text | Ctrl+U |
| `strike` | Strikethrough text | - |
| `textwrap` | Wrap text within cell | - |

#### Colors

```javascript
{
  color: '#RRGGBB',     // Text color (hex)
  bgcolor: '#RRGGBB'    // Background color (hex)
}
```

Color picker supports:
- 16 basic colors
- Custom hex color input
- Theme colors

#### Borders

```javascript
{
  border: {
    top: ['thin', '#000000'],
    bottom: ['thin', '#000000'],
    left: ['thin', '#000000'],
    right: ['thin', '#000000']
  }
}
```

---

## Data Validation

### Validation Types

Located in: `src/core/validation.js`

```javascript
// Validation modes
{
  mode: 'list' | 'number' | 'date' | 'email' | 'phone' | 'custom'
}
```

### Validation Configuration

```javascript
// Add validation
dataProxy.addValidation('list', 'A1:A10', {
  type: 'list',
  required: true,
  value: ['Option 1', 'Option 2', 'Option 3']
});

// Number validation with range
dataProxy.addValidation('number', 'B2:B100', {
  type: 'number',
  operator: 'between',
  value1: 0,
  value2: 1000
});

// Date validation
dataProxy.addValidation('date', 'C2:C100', {
  type: 'date',
  operator: 'greaterThan',
  value1: '2024-01-01'
});

// Email validation
dataProxy.addValidation('email', 'D2:D100', {
  type: 'email'
});
```

### Validation Operators

| Operator | Code | Description |
|----------|-----|-------------|
| between | `'be'` | Between two values |
| not between | `'nbe'` | Not between two values |
| less than | `'lt'` | Less than value |
| less than or equal | `'lte'` | Less than or equal |
| greater than | `'gt'` | Greater than |
| greater than or equal | `'gte'` | Greater than or equal |
| equal | `'eq'` | Equal to |
| not equal | `'neq'` | Not equal to |

### Validation Messages

```javascript
{
  required: 'This field is required',
  notMatch: 'Value does not match validation rule',
  between: 'Value must be between {} and {}',
  notBetween: 'Value must not be between {} and {}',
  notIn: 'Value is not in the allowed list',
  equal: 'Value must equal {}',
  notEqual: 'Value must not equal {}',
  lessThan: 'Value must be less than {}',
  lessThanEqual: 'Value must be less than or equal to {}',
  greaterThan: 'Value must be greater than {}',
  greaterThanEqual: 'Value must be greater than or equal to {}'
}
```

---

## Keyboard Shortcuts

### Editing Shortcuts

| Shortcut | Action | Description |
|---------|--------|-------------|
| Enter | Confirm edit, move down | Confirm cell edit, move to cell below |
| Tab | Confirm edit, move right | Confirm cell edit, move to next cell |
| Escape | Cancel edit | Cancel current edit, restore original value |
| Backspace | Delete before | Delete character before cursor |
| Delete | Delete after | Delete character after cursor |
| Alt+Enter | New line | Insert line break in cell |
| Arrow keys | Navigate | Move between cells |
| Ctrl+Arrow | Jump | Jump to edge of data region |

### Selection Shortcuts

| Shortcut | Action | Description |
|---------|--------|-------------|
| Shift+Arrow | Extend selection | Extend selection by one cell |
| Ctrl+Shift+Arrow | Jump select | Extend selection to edge |
| Ctrl+A | Select all | Select entire sheet |

### Formatting Shortcuts

| Shortcut | Action | Description |
|---------|--------|-------------|
| Ctrl+B | Toggle bold | Toggle bold formatting |
| Ctrl+I | Toggle italic | Toggle italic formatting |
| Ctrl+U | Toggle underline | Toggle underline formatting |

### Clipboard Shortcuts

| Shortcut | Action | Description |
|---------|--------|-------------|
| Ctrl+C | Copy | Copy selected cells |
| Ctrl+V | Paste | Paste from clipboard |
| Ctrl+X | Cut | Cut selected cells |
| Ctrl+Alt+V | Paste format | Paste format only |
| Ctrl+Shift+V | Paste value | Paste values only |

### Edit Operations

| Shortcut | Action | Description |
|---------|--------|-------------|
| Ctrl+Z | Undo | Undo last action |
| Ctrl+Y | Redo | Redo last action |
| Delete | Clear | Clear cell content |
| Ctrl+Shift+= | Insert | Open insert dialog |
| Ctrl+- | Delete | Open delete dialog |

### Navigation Shortcuts

| Shortcut | Action | Description |
|---------|--------|-------------|
| Home | First cell | Move to first cell in row |
| End | Last cell | Move to last cell in row with data |
| Page Up | Page up | Move up one page |
| Page Down | Page down | Move down one page |

---

## Toolbars Reference

Located in: `src/component/toolbar/index.js`

### Toolbar Structure

```
Toolbar
├── Group 1: History
│   ├── Undo
│   ├── Redo
│   ├── Print
│   ├── Paint Format
│   └── Clear Format
│
├── Group 2: Format
│   └── Number Format dropdown
│
├── Group 3: Font
│   ├── Font family dropdown
│   └── Font size dropdown
│
├── Group 4: Text Style
│   ├── Bold (B)
│   ├── Italic (I)
│   ├── Underline (U)
│   ├── Strikethrough (S)
│   └── Text Color
│
├── Group 5: Cell Style
│   ├── Fill Color
│   ├── Borders
│   └── Merge
│
├── Group 6: Alignment
│   ├── Horizontal align
│   ├── Vertical align
│   └── Text wrap
│
├── Group 7: Data
│   ├── Freeze
│   ├── Filter
│   └── Functions
│
└── Group 8: More
    └── Additional tools dropdown
```

---

## Context Menu Reference

Located in: `src/component/contextmenu.js`

### Menu Items

| Key | Title | Shortcut |
|-----|-------|----------|
| copy | Copy | Ctrl+C |
| cut | Cut | Ctrl+X |
| paste | Paste | Ctrl+V |
| paste-value | Paste values only | Ctrl+Shift+V |
| paste-format | Paste format only | Ctrl+Alt+V |
| insert-row | Insert row | - |
| insert-column | Insert column | - |
| delete-row | Delete row | - |
| delete-column | Delete column | - |
| delete-cell-text | Delete cell text | Delete |
| hide | Hide | - |
| validation | Data validations | - |
| cell-printable | Enable export | - |
| cell-non-printable | Disable export | - |
| cell-editable | Enable editing | - |
| cell-non-editable | Disable editing | - |

---

## Auto-Filter System

Located in: `src/core/auto_filter.js`

### Enabling Auto-Filter

```javascript
// Enable filter
dataProxy.autofilter();

// Disable filter
dataProxy.autofilter();  // Toggle
```

### Filter Operations

```javascript
// Add filter to column
dataProxy.setAutoFilter(ci, order, operator, value);

// Get filtered rows
const { rset, fset } = autoFilter.filteredRows((r, c) => rows.getCell(r, c));
```

### Filter Configuration

```javascript
{
  ref: 'A1:D10',         // Filter range
  sort: {                // Sort configuration
    ci: 0,             // Column index
    order: 'asc' | 'desc'
  },
  filters: [            // Column filters
    {
      ci: 0,
      operator: 'eq' | 'ne' | 'gt' | 'lt' | ...,
      value: 'filter'
    }
  ]
}
```

---

## Freeze Panes

Located in: `src/core/data_proxy.js` (freeze methods)

### Freeze Configuration

```javascript
// Freeze first row
dataProxy.setFreeze(1, 0);

// Freeze first column
dataProxy.setFreeze(0, 1);

// Freeze at B3 (row 2, column 1)
dataProxy.setFreeze(2, 2);
```

### Freeze Types

| Freeze Type | Code | Description |
|------------|------|-------------|
| None | `[0, 0]` | No freeze |
| Row | `[n, 0]` | Freeze n rows |
| Column | `[0, n]` | Freeze n columns |
| Both | `[n, m]` | Freeze rows and columns |

---

## Style Management

Located in: `src/core/data_proxy.js` (style methods)

### Style Sharing

Styles are automatically shared to minimize memory:

```javascript
// Add style returning index (or existing match)
const styleIndex = dataProxy.addStyle({
  bgcolor: '#f0f0f0',
  align: 'center'
});
```

### Style Inheritance

Cell styles inherit from default style:

```javascript
// Get merged style (default + cell style)
const fullStyle = dataProxy.getCellStyleOrDefault(ri, ci);
```

---

## Undo/Redo System

Located in: `src/core/history.js`

### History Operations

```javascript
// Check if undo available
const canUndo = dataProxy.canUndo();

// Check if redo available
const canRedo = dataProxy.canRedo();

// Undo last action
dataProxy.undo();

// Redo last undone action
dataProxy.redo();
```

### History Stack

The history system maintains unlimited undo/redo:
- Each change creates a history entry
- Undo pops from undo stack, pushes to redo stack
- Redo pops from redo stack, pushes to undo stack
- New action clears redo stack

---

## Clipboard Operations

Located in: `src/core/clipboard.js`

### Clipboard Operations

```javascript
// Copy selection
dataProxy.copy();

// Copy to system clipboard
dataProxy.copyToSystemClipboard(event);

// Cut selection
dataProxy.cut();

// Paste
dataProxy.paste('all');  // 'all' | 'text' | 'format'

// Paste from system clipboard
dataProxy.pasteFromSystemClipboard(resetSheet, eventTrigger);
```

### Paste Modes

| Mode | Description |
|------|-------------|
| `'all'` | Paste values and formatting |
| `'text'` | Paste values only |
| `'format'` | Paste formatting only |

---

## Internationalization

Located in: `src/locale/`

### Supported Languages

| Code | Language |
|------|----------|
| `'en'` | English (default) |
| `'zh-cn'` | Chinese Simplified |
| `'zh-tw'` | Chinese Traditional |
| `'de'` | German |
| `'nl'` | Dutch |

### Using Locale

```javascript
// Set language
x_spreadsheet.locale('zh-cn');

// Custom messages
x_spreadsheet.locale('custom', {
  toolbar: {
    undo: '撤销',
    redo: '重做',
    // ...
  },
  contextmenu: {
    // ...
  }
});
```

---

## Rendering System

### Canvas Rendering

Located in: `src/canvas/draw.js`

### Render Cycle

1. **Clear canvas**: Clear previous frame
2. **Draw grid**: Grid lines and headers
3. **Draw cells**: Cell backgrounds and borders
4. **Draw content**: Text and numbers
5. **Draw selection**: Selection highlights
6. **Draw editor**: Mobile inline editor

### Device Pixel Ratio

```javascript
const dpr = window.devicePixelRatio || 1;
ctx.scale(dpr, dpr);
```

This ensures crisp rendering on high-DPI displays.

---

## Performance Optimization

### Large Dataset Handling

#### Virtual Scrolling

Only visible cells are rendered:

```javascript
// Located in: src/core/data_proxy.js
viewRange() {
  // Calculate visible range only
  let { ri, ci } = scroll;
  // ... render only visible cells
}
```

#### Style Sharing

Identical styles share a single index:

```javascript
// Style deduplication
addStyle(nstyle) {
  for (let i = 0; i < styles.length; i += 1) {
    if (equals(style, nstyle)) return i;  // Return existing
  }
  styles.push(nstyle);  // Add new
  return styles.length - 1;
}
```

#### Sparse Array Storage

Only non-empty cells are stored:

```javascript
// Sparse object storage
cells: {
  0: { text: 'Value' },
  5: { text: 'Another' }
}
```

### Best Practices

1. **Reduce default rows/columns**: Set minimum necessary
2. **Use lazy loading**: Load data on demand
3. **Batch updates**: Use loadData() instead of individual updates
4. **Disable unnecessary features**: Hide toolbar, grid when not needed

---

## Common Patterns

### Data Persistence

```javascript
// Save to localStorage
spreadsheet.change((data) => {
  localStorage.setItem('spreadsheet-data', JSON.stringify(data));
});

// Load from localStorage
const saved = localStorage.getItem('spreadsheet-data');
if (saved) {
  spreadsheet.loadData(JSON.parse(saved));
}
```

### Export to JSON

```javascript
const exportData = () => {
  const data = spreadsheet.getData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'spreadsheet.json';
  a.click();
};
```

### Import from JSON

```javascript
const importData = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    spreadsheet.loadData(data);
  };
  reader.readAsText(file);
};
```

### Custom Export

```javascript
const exportCSV = () => {
  const data = spreadsheet.getData();
  const rows = data[0].rows;
  let csv = '';
  
  // Generate CSV
  for (let i = 0; i < rows.len; i += 1) {
    const row = rows[i];
    if (row && row.cells) {
      const values = Object.values(row.cells);
      csv += values.map(v => v.text).join(',') + '\n';
    }
  }
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  // ... download logic
};
```

---

## Troubleshooting

### Common Issues

#### 1. Formulas Not Calculating

**Symptoms**: Formula shows as text, not result.

**Solutions**:
- Ensure formula starts with `=`
- Check for valid cell references
- Verify formula syntax

#### 2. Paste Not Working

**Symptoms**: Ctrl+V doesn't paste.

**Solutions**:
- Use HTTPS (required for clipboard API)
- Check browser permissions
- Try right-click menu paste

#### 3. Performance Issues

**Symptoms**: Slow with large data.

**Solutions**:
- Reduce default row/column count
- Disable unused features
- Use view dimensions for limited viewport

#### 4. CSS Not Loading

**Symptoms**: Unstyled spreadsheet.

**Solutions**:
- Include xspreadsheet.css after JS
- Check file paths
- Verify CSS loads before JS

#### 5. Cells Not Editable

**Symptoms**: Cannot type in cells.

**Solutions**:
```javascript
// Check mode option
const spreadsheet = Spreadsheet('#el', { mode: 'edit' });

// Check data validation
// Ensure cell is not set to non-editable via context menu
```

---

## API Summary

### Quick Reference

```javascript
// Create
new Spreadsheet('#id', options)

// Load data
.loadData([{...}])

// Get data
.getData()

// Cell operations
.cellText(r, c, text)
.cell(r, c)
.cellStyle(r, c)

// Events
.on('event', callback)
.change(callback)

// Utility
.reRender()
.deleteSheet()

// Static
Spreadsheet.locale('lang')
```

---

## License

MIT License

---

## Changelog

### Version 1.0.20

- Initial stable release
- Canvas rendering
- Formulas support
- Multi-sheet support
- Data validation
- Auto-filter
- Freeze panes
- Undo/Redo
- Context menu

---

## Contributing

Issues and pull requests welcome on GitHub.

---

## Support

For issues: https://github.com/myliang/x-spreadsheet/issues