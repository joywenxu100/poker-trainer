// Zero-Mistake Helper - Core Logic
// Simple version for quick deployment

let gameState = {
    street: 'preflop',
    blind: '124',
    position: 'Straddle',
    stack: 300,
    pot: 12,
    players: '2',
    opponentAction: '',
    villain: 'unknown',
    board: '',
    texture: 'dry',
    draw: 'none',
    riverComplete: 'none'
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-street]').forEach(btn => {
        btn.addEventListener('click', function() {
            selectButton(this, 'data-street');
            gameState.street = this.dataset.street;
            updateBoardVisibility();
        });
    });

    document.querySelectorAll('[data-blind], [data-position], [data-players], [data-villain], [data-texture], [data-draw], [data-complete]').forEach(btn => {
        btn.addEventListener('click', function() {
            const attr = btn.dataset.street ? 'data-street' : 
                        btn.dataset.blind ? 'data-blind' :
                        btn.dataset.position ? 'data-position' :
                        btn.dataset.players ? 'data-players' :
                        btn.dataset.villain ? 'data-villain' :
                        btn.dataset.texture ? 'data-texture' :
                        btn.dataset.draw ? 'data-draw' : 'data-complete';
            selectButton(this, attr);
            
            if(btn.dataset.blind) gameState.blind = btn.dataset.blind;
            if(btn.dataset.position) gameState.position = btn.dataset.position;
            if(btn.dataset.players) gameState.players = btn.dataset.players;
            if(btn.dataset.villain) gameState.villain = btn.dataset.villain;
            if(btn.dataset.texture) gameState.texture = btn.dataset.texture;
            if(btn.dataset.draw) gameState.draw = btn.dataset.draw;
            if(btn.dataset.complete) gameState.riverComplete = btn.dataset.complete;
        });
    });
});

function selectButton(btn, dataAttr) {
    const group = btn.closest('.btn-group');
    group.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function updateBoardVisibility() {
    const boardSection = document.getElementById('boardSection');
    const drawSection = document.getElementById('drawSection');
    const riverCompleteSection = document.getElementById('riverCompleteSection');
    
    if (gameState.street !== 'preflop') {
        boardSection.style.display = 'block';
        if (gameState.street === 'turn') {
            drawSection.style.display = 'block';
            riverCompleteSection.style.display = 'none';
        } else if (gameState.street === 'river') {
            drawSection.style.display = 'none';
            riverCompleteSection.style.display = 'block';
        } else {
            drawSection.style.display = 'none';
            riverCompleteSection.style.display = 'none';
        }
    } else {
        boardSection.style.display = 'none';
    }
}

function analyzeAndAlert() {
    gameState.stack = parseFloat(document.getElementById('effectiveStack').value) || 300;
    gameState.pot = parseFloat(document.getElementById('potSize').value) || 12;
    gameState.opponentAction = document.getElementById('opponentAction').value || '';
    gameState.board = document.getElementById('boardCards')?.value || '';

    const spr = (gameState.stack / gameState.pot).toFixed(1);
    const potOdds = ((gameState.pot * 0.5) / (gameState.pot * 2) * 100).toFixed(1);
    const mdf = ((1 - (gameState.pot * 0.67) / (gameState.pot * 1.67)) * 100).toFixed(1);

    const alerts = generateAlerts(spr, potOdds, mdf);
    displayAlerts(alerts);
    displayStats(spr, potOdds, mdf);

    document.getElementById('alertSection').classList.add('show');
    document.getElementById('alertSection').scrollIntoView({ behavior: 'smooth' });
}

function generateAlerts(spr, potOdds, mdf) {
    const alerts = [];
    const { street, position, players, stack, pot, villain, texture, draw, riverComplete } = gameState;

    if (street === 'turn' && draw === 'flush') {
        alerts.push({
            type: 'critical',
            title: '🚨 Opponent Flush Draw Alert',
            content: [
                'You marked: Opponent may have flush draw',
                '',
                '💀 If 3rd/4th flush card hits river, you MUST be ready to fold!',
                '',
                '✅ Correct turn play:',
                '  - Strong hand (two pair+) → Bet ≥2/3 pot, make draws pay',
                '  - Marginal hand (top pair) → Check or small bet, prepare to fold river',
                '',
                '❌ Wrong turn play:',
                '  - Check free card → River completes flush → Opponent bets → You fold big hand → Lose big pot',
                '',
                '🧠 River fold checklist when 4th flush hits:',
                '  ❌ Three of a kind → Fold immediately',
                '  ❌ Two pair → Fold immediately',
                '  ❌ Top pair → Instant fold'
            ]
        });
    }

    if (street === 'river' && riverComplete === 'flush') {
        alerts.push({
            type: 'critical',
            title: '🚨 River Completed Flush! Instant Fold Alert',
            content: [
                '💀💀💀 Board completed flush! Most dangerous river!',
                '',
                '🚨 Execute fold checklist immediately:',
                '  ❌ Three of a kind vs any bet → Fold immediately',
                '  ❌ Two pair vs any bet → Fold immediately',
                '  ❌ Top pair vs any bet → Fold immediately',
                '  ❌ Small flush vs big bet (≥pot) → Fold immediately',
                '  ✅ Nut flush (A-high) → Can call/raise',
                '',
                '💡 Pro vs Amateur difference:',
                '  - Amateur: Hold strong hand, can\'t fold → Lose big pot',
                '  - Pro: Flush completes, instant fold → Save 50-200BB'
            ]
        });
    }

    alerts.push({
        type: 'info',
        title: '💡 Key Data Quick Reference',
        content: [
            `📍 Your position: ${position}`,
            `💰 SPR: ${spr}`,
            `  - SPR < 5 = Committed pot`,
            `  - SPR 5-15 = Normal`,
            `  - SPR > 30 = Deep stack`,
            `🎯 Pot odds: ${potOdds}%`,
            `🛡️ MDF: ${mdf}%`,
            `👥 Players: ${players}`
        ]
    });

    return alerts;
}

function displayAlerts(alerts) {
    const container = document.getElementById('alertContainer');
    container.innerHTML = '';

    alerts.forEach(alert => {
        const card = document.createElement('div');
        card.className = `alert-card alert-${alert.type}`;

        const title = document.createElement('div');
        title.className = 'alert-title';
        title.textContent = alert.title;

        const content = document.createElement('div');
        content.className = 'alert-content';

        if (Array.isArray(alert.content)) {
            const ul = document.createElement('ul');
            alert.content.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            content.appendChild(ul);
        } else {
            content.textContent = alert.content;
        }

        card.appendChild(title);
        card.appendChild(content);
        container.appendChild(card);
    });
}

function displayStats(spr, potOdds, mdf) {
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
        <div class="stat-item">
            <div class="stat-label">SPR</div>
            <div class="stat-value">${spr}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Pot Odds</div>
            <div class="stat-value">${potOdds}%</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">MDF</div>
            <div class="stat-value">${mdf}%</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Position</div>
            <div class="stat-value">${gameState.position}</div>
        </div>
    `;
}

function resetHelper() {
    document.getElementById('effectiveStack').value = '300';
    document.getElementById('potSize').value = '12';
    document.getElementById('opponentAction').value = '';
    if (document.getElementById('boardCards')) {
        document.getElementById('boardCards').value = '';
    }

    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-street="preflop"]').classList.add('active');
    document.querySelector('[data-blind="124"]').classList.add('active');
    document.querySelector('[data-position="Straddle"]').classList.add('active');
    document.querySelector('[data-players="2"]').classList.add('active');
    document.querySelector('[data-villain="unknown"]').classList.add('active');

    document.getElementById('alertSection').classList.remove('show');

    gameState = {
        street: 'preflop',
        blind: '124',
        position: 'Straddle',
        stack: 300,
        pot: 12,
        players: '2',
        opponentAction: '',
        villain: 'unknown',
        board: '',
        texture: 'dry',
        draw: 'none',
        riverComplete: 'none'
    };

    updateBoardVisibility();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
