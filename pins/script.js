const createRow = () => {
    const row = document.createElement('div');
    row.classList.add('pin-row');
    return row;
}

const createCell = (value) => {
    const cell = document.createElement('div');
    cell.classList.add('pin-cell');
    cell.classList.add('p-tooltip--top-center');
    cell.setAttribute('aria-describedby', `tooltip-${value}`);
    cell.style.background = `rgb(${value}, 0, 0)`;
    return cell;
}

const createTooltip = (value, total, pos) => {
    const tooltip = document.createElement('span');
    tooltip.classList.add('p-tooltip__message');
    tooltip.role = 'tooltip';
    tooltip.id = `tooltip-${value}`;
    pos = pos.toString().padStart(4, '0');
    const amount = value/total*100;
    tooltip.textContent = `${pos} ${amount.toFixed(4)}`;
    return tooltip;
}

const render = () => {
    const root = document.getElementById('pin-table');
    const total = pins.reduce((acc, occ) => acc + occ, 0);

    for (let x = 0; x < 100; x++) {
        const row = createRow();
        for (let y = 0; y < 100; y++) {
            const index = x * 100 + y;
            const cell = createCell(pins[index]);
            const tooltip = createTooltip(pins[index], total, index);
            cell.appendChild(tooltip);
            row.appendChild(cell);
        }
        root.appendChild(row);
    }
}

window.addEventListener('load', render);