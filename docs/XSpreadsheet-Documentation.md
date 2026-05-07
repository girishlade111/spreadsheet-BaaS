# x-spreadsheet Documentation

A powerful web-based spreadsheet component built with HTML5 Canvas. Provides a complete Excel-like editing experience in the browser with support for formulas, formatting, cell merging, data validation, and more.

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [Features](#features)
5. [Configuration Options](#configuration-options)
6. [API Reference](#api-reference)
7. [Events](#events)
8. [Data Structure](#data-structure)
9. [Formulas](#formulas)
10. [Cell Formatting](#cell-formatting)
11. [Keyboard Shortcuts](#keyboard-shortcuts)
12. [Internationalization](#internationalization)

---

## Installation

### npm

```bash
npm install x-data-spreadsheet
```

### CDN

```html
<script src="https://unpkg.com/x-data-spreadsheet@1.0.20/dist/xspreadsheet.js"></script>
<link rel="stylesheet" href="https://unpkg.com/x-data-spreadsheet@1.0.20/dist/xspreadsheet.css">
```

---

## Quick Start

### Basic Usage

```javascript
import Spreadsheet from 'x-data-spreadsheet';

const spreadsheet = Spreadsheet('#container', {
  showToolbar: true,
  showGrid: true,
  showBottomBar: true
});

spreadsheet.loadData([{
  name: 'Sheet1',
  rows: {
    1: { cells: { 0: { text: 'Hello' }, 1: { text: 'World' } } },
    2: { cells: { 0: { text: 100 }, 1: { text: 200 } } }
  }
}]);
```

### Initializing with Multiple Sheets

```javascript
const spreadsheet = Spreadsheet('#container', {
  showToolbar: true,
  showGrid: true,
  showBottomBar: true
});

spreadsheet.loadData([
  {
    name: 'Sales',
    freeze: 'B3',
    rows: {
      1: { cells: { 0: { text: 'Product' }, 1: { text: 'Q1' }, 2: { text: 'Q2' } } }
    }
  },
  {
    name: 'Expenses',
    rows: {
      1: { cells: { 0: { text: 'Category' }, 1: { text: 'Amount' } } }
    }
  }
]);
```

---

## Core Concepts

### Architecture Overview

x-spreadsheet follows a Model-View-Controller (MVC) architecture pattern:

```
┌─────────────────────────────────────────────────────────┐
│                     Spreadsheet                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │    View     │  │   Model    │  │   Controller    │  │
│  │  (Canvas)  │  │(DataProxy)│  │  (User Input)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Key Components

#### Spreadsheet (Main Class)

The main entry point that orchestrates the entire spreadsheet component. Manages multiple sheets through the Bottombar.

#### DataProxy

The underlying data model representing a single sheet. Handles:
- Cell data storage and retrieval
- Row and column management
- Style management
- Merged cells tracking
- Clipboard operations
- Undo/Redo history
- Auto-filtering
- Data validation

#### Sheet (View)

The visual representation using HTML5 Canvas for high-performance rendering.

---

## Features

### 1. Cell Editing

#### Text Input
- Direct typing in cells
- Formula input (starts with `=`)
- Multi-line text support

#### Cell Selection
- Click to select single cell
- Shift+Click for range selection
- Click and drag for area selection
- Click column header to select entire column
- Click row header to select entire row

#### Cell Positioning
- A1 notation support (e.g., A1, B2, C3)
- Also accepts numerical coordinates (rowIndex, colIndex)

### 2. Row and Column Operations

#### Insert Rows/Columns
- Right-click context menu
- Toolbar buttons: Insert Row Above, Insert Row Below, Insert Column Left, Insert Column Right
- Keyboard: Ctrl+Shift+= (opens insert dialog)

#### Delete Rows/Columns
- Right-click context menu
- Delete key to clear content
- Ctrl+- for delete dialog

#### Resize
- Drag column/row headers to resize
- Double-click to auto-fit content

#### Hide/Unhide
- Hide rows via context menu
- Hide columns via context menu
- Unhide from context menu

### 3. Cell Formatting

#### Text Formatting
- **Bold** (Ctrl+B)
- *Italic* (Ctrl+I)
- <u>Underline</u> (Ctrl+U)
- ~~Strikethrough~~

#### Font Settings
- Font family selection (Arial, Helvetica, Times New Roman, etc.)
- Font size (8-72pt)

#### Text Alignment
- Horizontal: Left, Center, Right
- Vertical: Top, Middle, Bottom

#### Text Wrapping
- Wrap text within cell
- Don't wrap

#### Cell Colors
- Text color (font color)
- Background color (fill color)

#### Number Formatting
- General
- Number (with decimal places)
- Currency
- Percentage
- Date
- Time
- Custom formats

### 4. Border Styles

```
┌────────────────────────────────────┐
│ Border Options                     │
├────────────────────────────────────┤
│ • None                            │
│ • Outline                         │
│ • Inside                          │
│ • Top                            │
│ • Bottom                         │
│ • Left                           │
│ • Right                          │
├────────────────────────────────────┤
│ Border Styles                      │
├────────────────────────────────────┤
│ - Thin (default)                  │
│ - Medium                         │
│ - Thick                          │
│ - Dashed                         │
│ - Dotted                         │
└────────────────────────────────────┘
```

### 5. Cell Merging

The spreadsheet supports merged cells for creating spanning headers and complex layouts.

- Select multiple cells and click "Merge" in toolbar
- Click "Merge" again to unmerge
- Merged cells maintain the top-left cell's content and formatting

### 6. Data Validation

Supports data validation rules for controlling cell input:

#### Validation Types
- **List**: Dropdown selection from a list
- **Number**: Numeric input with min/max range
- **Date**: Date validation
- **Email**: Email format validation
- **Custom**: Custom formula validation

#### Validation Actions
- Show input message when cell is selected
- Show error alert on invalid input
- Reject invalid data
- Stop on invalid data

### 7. Formulas

Built-in formula support with 80+ Excel-compatible functions.

#### Basic Operations
- SUM, AVERAGE, MAX, MIN
- IF (conditional logic)
- AND, OR (logical operations)
- CONCAT (text concatenation)

#### Advanced Functions
- VLOOKUP, HLOOKUP
- COUNT, COUNTA, COUNTIF
- Date and time functions
- Text manipulation functions
- Mathematical functions

#### Formula Syntax
```
=SUM(A1:A10)        // Sum of range
=AVERAGE(B2:B5)    // Average of range
=IF(A1>10, "Yes", "No")  // Conditional
=SUM(A1,B2,C3)     // Add multiple cells
=A1*B1             // Cell multiplication
```

### 8. Auto-Filter

Enables data filtering on column headers:

- Click "Filter" button to enable
- Click column header dropdown to filter
- Filter by specific values
- Sort ascending/descending
- Clear filters

### 9. Freeze Panes

Freeze rows and/or columns to keep them visible while scrolling:

- Click "Freeze" dropdown
- Freeze first row
- Freeze first column
- Freeze selected rows/columns

### 10. Copy & Paste

#### Within Spreadsheet
- Ctrl+C to copy
- Ctrl+V to paste
- Ctrl+X to cut
- Paste from external applications (Excel, Google Sheets)

#### Paste Options
- Paste all (values and formatting)
- Paste values only
- Paste format only

#### Fill Handle
- Drag cell corner to auto-fill
- Drag to copy or increment sequences

### 11. Undo/Redo

Full undo/redo support:

- Ctrl+Z: Undo
- Ctrl+Y: Redo
- Toolbar buttons for undo/redo

### 12. Paint Format

Apply formatting from one cell to others:

- Select source cell
- Click "Paint Format" in toolbar
- Click target cells to apply formatting

### 13. Multi-Sheet Support

Multiple sheets within a single spreadsheet:

- Add new sheet (+ button)
- Rename sheet (double-click tab)
- Delete sheet (right-click context menu)
- Reorder sheets (drag tabs)
- Switch between sheets (click tabs)

### 14. Context Menu

Right-click for quick actions:

- Cut, Copy, Paste
- Insert/Delete Rows/Columns
- Hide/Unhide
- Filter
- Clear content
- Format cells
- Sort options

### 15. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+C | Copy |
| Ctrl+V | Paste |
| Ctrl+X | Cut |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+B | Bold |
| Ctrl+I | Italic |
| Ctrl+U | Underline |
| Delete | Clear cell |
| Tab | Next cell |
| Enter | Confirm and move down |
| Escape | Cancel edit |

---

## Configuration Options

### Options Object

```javascript
const options = {
  // Display Options
  mode: 'edit',           // 'edit' | 'read'
  showToolbar: true,       // Show/hide toolbar
  showGrid: true,         // Show/hide grid lines
  showContextmenu: true,  // Show/hide context menu
  showBottomBar: true,   // Show/hide bottom sheet tabs

  // Focus
  autoFocus: true,        // Auto-focus on init

  // Custom Toolbar
  extendToolbar: {
    left: [],             // Custom buttons on left
    right: []            // Custom buttons on right
  },

  // View Dimensions
  view: {
    height: () => window.innerHeight,
    width: () => window.innerWidth
  },

  // Row Settings
  row: {
    len: 100,           // Default 100 rows
    height: 25          // Default row height
  },

  // Column Settings
  col: {
    len: 26,           // Default 26 columns (A-Z)
    width: 100,         // Default column width
    indexWidth: 60,    // Row index column width
    minWidth: 60       // Minimum column width
  },

  // Default Style
  style: {
    bgcolor: '#ffffff',
    align: 'left',
    valign: 'middle',
    textwrap: false,
    strike: false,
    underline: false,
    color: '#0a0a0a',
    font: {
      name: 'Arial',
      size: 10,
      bold: false,
      italic: false
    }
  }
};
```

### Default Settings Reference

| Option | Default | Description |
|--------|---------|-------------|
| `mode` | `'edit'` | Editing mode or read-only |
| `showToolbar` | `true` | Display formatting toolbar |
| `showGrid` | `true` | Display grid lines |
| `showContextmenu` | `true` | Display right-click menu |
| `showBottomBar` | `true` | Display sheet tabs |
| `autoFocus` | `true` | Auto-focus the component |
| `row.len` | `100` | Initial number of rows |
| `row.height` | `25` | Default row height in pixels |
| `col.len` | `26` | Initial number of columns |
| `col.width` | `100` | Default column width in pixels |
| `col.indexWidth` | `60` | Row header column width |
| `col.minWidth` | `60` | Minimum column width |

---

## API Reference

### Constructor

```javascript
new Spreadsheet(container, options)
```

**Parameters:**
- `container` (string|HTMLElement): CSS selector or DOM element
- `options` (object): Configuration options

### Methods

#### loadData(data)

Load spreadsheet data.

```javascript
spreadsheet.loadData([
  {
    name: 'Sheet1',
    freeze: 'B3',
    styles: [],
    merges: ['A1:B2'],
    rows: { 1: { cells: { 0: { text: 'Hello' } } } },
    cols: { len: 26, 2: { width: 200 } }
  }
]);
```

#### getData()

Get current spreadsheet data as JSON.

```javascript
const data = spreadsheet.getData();
// Returns array of sheet objects
```

#### cellText(rowIndex, colIndex, text, sheetIndex)

Set cell text content.

```javascript
spreadsheet.cellText(0, 0, 'Hello');
spreadsheet.cellText(0, 0, 'Hello', 0);  // With sheet index
```

#### cell(rowIndex, colIndex, sheetIndex)

Get cell data.

```javascript
const cell = spreadsheet.cell(0, 0);
// Returns: { text: 'Hello', style: 0, merge: null }
```

#### cellStyle(rowIndex, colIndex, sheetIndex)

Get cell style.

```javascript
const style = spreadsheet.cellStyle(0, 0);
// Returns: { color: '#000000', bgcolor: '#ffffff', ... }
```

#### reRender()

Force re-render of the spreadsheet.

```javascript
spreadsheet.reRender();
```

#### deleteSheet()

Delete current sheet.

```javascript
spreadsheet.deleteSheet();
```

### Events

#### on(eventName, callback)

Bind event handler.

```javascript
// Cell selected event
spreadsheet.on('cell-selected', (cell, ri, ci) => {
  console.log('Selected:', ri, ci, cell);
});

// Multiple cells selected
spreadsheet.on('cells-selected', (cell, { sri, sci, eri, eci }) => {
  console.log('Range:', sri, sci, eri, eci);
});

// Cell edited
spreadsheet.on('cell-edited', (text, ri, ci) => {
  console.log('Edited:', ri, ci, text);
});

// Data changed
spreadsheet.change((data) => {
  console.log('Data changed:', data);
});
```

#### Event Types

| Event | Parameters | Description |
|-------|------------|-------------|
| `cell-selected` | `(cell, ri, ci)` | Single cell selected |
| `cells-selected` | `(cell, {sri, sci, eri, eci})` | Range selected |
| `cell-edited` | `(text, ri, ci)` | Cell content edited |
| `change` | `(data)` | Any data change |

### Static Methods

#### Spreadsheet.locale(lang, messages)

Set localization messages.

```javascript
Spreadsheet.locale('zh-cn', {
  toolbar: {
    undo: '撤销',
    redo: '重做'
  },
  // More messages...
});
```

---

## Data Structure

### Sheet Data Format

```javascript
{
  name: 'Sheet1',           // Sheet name
  freeze: 'B3',            // Frozen rows/columns (cell reference)
  styles: [                // Array of style definitions
    {
      bgcolor: '#ffffff',
      align: 'left',
      valign: 'middle',
      textwrap: false,
      strike: false,
      underline: false,
      color: '#0a0a0a',
      font: {
        name: 'Arial',
        size: 10,
        bold: false,
        italic: false
      },
      border: {
        top: ['thin', '#000000'],
        bottom: ['thin', '#000000'],
        left: ['thin', '#000000'],
        right: ['thin', '#000000']
      },
      format: 'normal'
    }
  ],
  merges: ['A1:C2'],      // Merged cell ranges
  rows: {                   // Row data
    len: 100,              // Total rows
    1: {                   // Row 1 (1-indexed)
      height: 25,          // Custom row height
      style: 0,            // Style index
      cells: {              // Cells in this row
        0: {               // Column 0 (A)
          text: 'Value',
          style: 0,        // Style index
          merge: [0, 0]    // Merge rows, cols
        }
      }
    }
  },
  cols: {                  // Column data
    len: 26,              // Total columns
    2: {                  // Column C
      width: 200          // Custom width
    }
  }
}
```

### Style Definition

```javascript
{
  bgcolor: '#ffffff',       // Background color
  align: 'left',         // Horizontal align: 'left' | 'center' | 'right'
  valign: 'middle',     // Vertical align: 'top' | 'middle' | 'bottom'
  textwrap: false,       // Text wrap
  strike: false,        // Strikethrough
  underline: false,     // Underline
  color: '#0a0a0a',    // Text color
  font: {
    name: 'Arial',      // Font family
    size: 10,          // Font size (points)
    bold: false,        // Bold
    italic: false       // Italic
  },
  border: {             // Borders (optional)
    top: ['thin', '#000000'],
    bottom: ['thin', '#000000'],
    left: ['thin', '#000000'],
    right: ['thin', '#000000']
  },
  format: 'normal'      // Number format
}
```

### Border Format

Each border is defined as: `[style, color]`

**Border Styles:**
- `'thin'`
- `'medium'`
- `'thick'`
- `'dashed'`
- `'dotted'`

---

## Formulas

### Built-in Formulas

| Function | Syntax | Description |
|----------|--------|-------------|
| SUM | `=SUM(range)` | Sum of values |
| AVERAGE | `=AVERAGE(range)` | Average of values |
| MAX | `=MAX(range)` | Maximum value |
| MIN | `=MIN(range)` | Minimum value |
| IF | `=IF(condition, true, false)` | Conditional logic |
| AND | `=AND(cond1, cond2, ...)` | Logical AND |
| OR | `=OR(cond1, cond2, ...)` | Logical OR |
| CONCAT | `=CONCAT(text1, text2, ...)` | Concatenate text |

### Formula Examples

```
=SUM(A1:A10)              // Sum A1 through A10
=AVERAGE(B2:B5)           // Average B2 through B5
=MAX(C1:C100)            // Maximum value in range
=MIN(D1:D50)             // Minimum value in range
=IF(A1>10, "Yes", "No")  // If A1 > 10
=AND(A1>0, B1>0)         // Both conditions true
=OR(A1="Yes", B1="Yes")  // Either condition true
=CONCAT(A1, " ", B1)     // Concatenate with space
```

### Cell References

- **Relative**: A1 (changes when copied)
- **Absolute**: $A$1 (fixed when copied)
- **Mixed**: $A1 or A$1

### Ranges

- **Continuous**: A1:B10
- **Discontinuous**: A1:A10,C1:C10
- **Entire row**: 1:1
- **Entire column**: A:A

---

## Cell Formatting

### Text Formatting Properties

```javascript
{
  // Alignment
  align: 'left' | 'center' | 'right',
  valign: 'top' | 'middle' | 'bottom',

  // Text Style
  bold: boolean,
  italic: boolean,
  underline: boolean,
  strike: boolean,
  textwrap: boolean,

  // Colors
  color: '#RRGGBB',     // Text color
  bgcolor: '#RRGGBB',   // Background color

  // Font
  font: {
    name: 'Font Name',
    size: 10,          // 8-72
    bold: boolean,
    italic: boolean
  },

  // Border
  border: {
    top: ['style', 'color'],
    bottom: ['style', 'color'],
    left: ['style', 'color'],
    right: ['style', 'color']
  },

  // Number Format
  format: 'normal' | 'number' | 'currency' | 'percent' | 'date' | 'time'
}
```

### Number Format Codes

| Format | Code Example | Output |
|--------|------------|-------|
| General | `0` | 1234.567 |
| Number | `0.00` | 1234.57 |
| Currency | `$#,##0.00` | $1,234.57 |
| Percentage | `0%` | 12% |
| Date | `mm/dd/yyyy` | 01/15/2024 |
| Time | `hh:mm AM/PM` | 03:45 PM |

---

## Keyboard Shortcuts

### Editing Shortcuts

| Shortcut | Action |
|---------|-------|
| Enter | Confirm edit, move down |
| Tab | Confirm edit, move right |
| Escape | Cancel edit |
| Backspace | Delete before cursor |
| Delete | Delete after cursor |
| Arrow Keys | Navigate cells |

### Formatting Shortcuts

| Shortcut | Action |
|---------|-------|
| Ctrl+B | Toggle Bold |
| Ctrl+I | Toggle Italic |
| Ctrl+U | Toggle Underline |
| Ctrl+S | Save (trigger change event) |

### Edit Operations

| Shortcut | Action |
|---------|-------|
| Ctrl+C | Copy |
| Ctrl+V | Paste |
| Ctrl+X | Cut |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+A | Select all |

### Dialog Shortcuts

| Shortcut | Action |
|---------|-------|
| Ctrl++ | Insert dialog |
| Ctrl+- | Delete dialog |
| Ctrl+Shift+= | Insert dialog |
| Ctrl+- | Delete dialog |

---

## Internationalization

### Supported Languages

- English (en) - Default
- Chinese Simplified (zh-cn)
- Dutch (nl)
- German (de)

### Setting Locale

```javascript
// Switch to Chinese
x_spreadsheet.locale('zh-cn');
```

### Custom Messages

```javascript
x_spreadsheet.locale('custom', {
  toolbar: {
    undo: 'Undo',
    redo: 'Redo',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    textColor: 'Text Color',
    fillColor: 'Fill Color',
    border: 'Borders',
    merge: 'Merge Cells',
    align: 'Align',
    valign: 'Vertical Align',
    textwrap: 'Text Wrap',
    freeze: 'Freeze',
    autofilter: 'Filter',
    formula: 'Functions',
    format: 'Format',
    link: 'Link',
    image: 'Image',
    clearformat: 'Clear Format',
    paste: 'Paste',
    pasteValue: 'Paste Values Only',
    pasteFormat: 'Paste Format Only',
    filter: 'Filter',
    sort: 'Sort',
    sortASC: 'Sort Ascending',
    sortDESC: 'Sort Descending'
  },
  contextmenu: {
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    pasteValue: 'Paste Values Only',
    pasteFormat: 'Paste Format Only',
    right: 'Insert Right',
    below: 'Insert Below',
    delete: 'Delete Cell',
    row: 'Delete Row',
    column: 'Delete Column',
    hide: 'Hide',
    hideColumns: 'Hide Columns',
    unhide: 'Unhide',
    filter: 'Filter',
    sort: 'Sort',
    sortASC: 'Sort Ascending',
    sortDESC: 'Sort Descending'
  },
  formula: {
    sum: 'Sum',
    average: 'Average',
    max: 'Max',
    min: 'Min',
    _if: 'If',
    and: 'And',
    or: 'Or',
    concat: 'Concat'
  },
  error: {
    pastMerge: 'Cannot paste into merged cell',
    q: 'Formula Error',
    ref: '#REF!',
    name: '#NAME?',
    value: '#VALUE!'
  }
});
```

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 60+ |
| Firefox | 60+ |
| Safari | 11+ |
| Edge | 79+ |

### Required Features

- HTML5 Canvas
- ES6+
- CSS3

---

## Performance Considerations

### Large Datasets

- Virtual scrolling for 10,000+ rows
- Lazy rendering of off-screen cells
- Efficient canvas redraw strategy

### Memory Management

- Style sharing across cells
- Merged cell optimization
- Sparse array storage

---

## Common Issues

### 1. Formulas Not Calculating

**Solution**: Ensure formula starts with `=` and cell references are valid.

### 2. Paste Not Working

**Solution**: Check browser clipboard permissions. Use HTTPS.

### 3. Performance Issues

**Solution**: 
- Reduce default row/column count
- Use virtual scrolling mode
- Limit visible area

### 4. CSS Not Loading

**Solution**: Ensure xspreadsheet.css is imported after JS library.

---

## Examples

### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Spreadsheet Demo</title>
  <link rel="stylesheet" href="xspreadsheet.css">
</head>
<body onload="init()">
  <div id="spreadsheet"></div>

  <script src="xspreadsheet.js"></script>
  <script>
    function init() {
      const data = [{
        name: 'Sales Report',
        freeze: 'B3',
        styles: [
          { bgcolor: '#f4f5f8', color: '#900b09', align: 'center' }
        ],
        merges: ['C3:D4'],
        rows: {
          1: {
            cells: {
              0: { text: 'Product', style: 0 },
              1: { text: 'Q1 Sales', style: 0 },
              2: { text: 'Q2 Sales', style: 0 }
            }
          },
          2: {
            cells: {
              0: { text: 'Widget', style: 0 },
              1: { text: 1000 },
              2: { text: 1500 }
            }
          }
        },
        cols: { len: 10, 2: { width: 200 } }
      }];

      var spreadsheet = x_spreadsheet('#spreadsheet', {
        showToolbar: true,
        showGrid: true,
        showBottomBar: true
      })
      .loadData(data)
      .change((cdata) => {
        console.log('Data changed:', cdata);
      });

      spreadsheet.on('cell-selected', (cell, ri, ci) => {
        console.log('Cell selected:', ri, ci);
      });
    }
  </script>
</body>
</html>
```

### Data Persistence Example

```javascript
// Save data
const saveData = () => {
  const data = spreadsheet.getData();
  localStorage.setItem('spreadsheet-data', JSON.stringify(data));
};

// Load data
const loadData = () => {
  const saved = localStorage.getItem('spreadsheet-data');
  if (saved) {
    spreadsheet.loadData(JSON.parse(saved));
  }
};

// Auto-save on change
spreadsheet.change(() => {
  saveData();
});
```

---

## License

MIT License

---

## Changelog

### Version 1.x

- Initial release
- Core spreadsheet functionality
- Basic formatting
- Formula support
- Multi-sheet support
- Data validation
- Auto-filter
- Freeze panes
- Undo/Redo
- Context menu

---

## Contributing

Contributions are welcome! Please submit issues and pull requests on GitHub.

---

## Support

For issues and questions, please use the GitHub issue tracker.