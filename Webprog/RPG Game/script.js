// Game State
let currentClass = null;
let currentStage = 1;
let player = null;
let enemy = null;
let playerTurn = true;
let completedStages = new Set();

// Class Definitions (Balanced + 3 Skills)
const CLASSES = {
  warrior: {
    name: "Warrior",
    baseStats: { HP: 140, MP: 40, ATK: 18, DEF: 16, MAT: 6, MDF: 8 },
    growthRates: { HP: 14, MP: 3, ATK: 2.5, DEF: 2, MAT: 0.5, MDF: 1 },
    scalars: { ATK: 1.1 },
    skills: [
      { name: "Slash", costType: "MP", cost: 0, type: "damage", atkScale: 1.2, defScale: 0.4 },
      { name: "Taunt", costType: "MP", cost: 15, type: "debuff", targetStat: "DEF", reduceBy: 5, duration: 2 },
      { name: "Second Wind", costType: "MP", cost: 25, type: "heal", baseHeal: 30, atkScale: 0.4 }
    ],
    elementalAffinity: { Physical: 0.9 }
  },
  archer: {
    name: "Archer",
    baseStats: { HP: 100, MP: 70, ATK: 14, DEF: 10, MAT: 12, MDF: 10 },
    growthRates: { HP: 10, MP: 6, ATK: 2, DEF: 1, MAT: 1.5, MDF: 1 },
    scalars: { ATK: 1.0, MAT: 1.2 },
    skills: [
      { name: "Arrow Shot", costType: "MP", cost: 0, type: "damage", atkScale: 1.0, defScale: 0.3 },
      { name: "Poison Arrow", costType: "MP", cost: 20, type: "damage", matScale: 0.9, element: "Poison", defScale: 0.2 },
      { name: "Evasion", costType: "MP", cost: 30, type: "buff", stat: "DEF", value: 10, duration: 2 }
    ],
    elementalAffinity: { Wind: 0.85 }
  },
  mage: {
    name: "Mage",
    baseStats: { HP: 80, MP: 100, ATK: 6, DEF: 6, MAT: 22, MDF: 18 },
    growthRates: { HP: 8, MP: 10, ATK: 0.5, DEF: 0.5, MAT: 3, MDF: 2.5 },
    scalars: { MAT: 1.4 },
    skills: [
      { name: "Fireball", costType: "MP", cost: 15, type: "damage", matScale: 1.3, mdfScale: 0.3, element: "Fire" },
      { name: "Heal", costType: "MP", cost: 25, type: "heal", baseHeal: 40, matScale: 0.7 },
      { name: "Arcane Shield", costType: "MP", cost: 35, type: "buff", stat: "MDF", value: 15, duration: 2 }
    ],
    elementalAffinity: { Fire: 0.8, Magic: 1.1 }
  }
};

// 12 Stages - Enemies scale with stage
const ENEMIES = {};
for (let i = 1; i <= 12; i++) {
  const isBoss = i === 11 || i === 12;
  const scale = 1 + (i - 1) * 0.15; // 15% stronger per stage
  
  if (i === 12) {
    // Final Boss
    ENEMIES[i] = {
      name: "Shadow King",
      baseStats: { HP: 300 * scale, MP: 120 * scale, ATK: 30 * scale, DEF: 25 * scale, MAT: 35 * scale, MDF: 30 * scale },
      elementalAffinity: { All: 1.0 }
    };
  } else if (i === 11) {
    // Mini Boss
    ENEMIES[i] = {
      name: "Chaos Golem",
      baseStats: { HP: 220 * scale, MP: 80 * scale, ATK: 22 * scale, DEF: 20 * scale, MAT: 15 * scale, MDF: 18 * scale },
      elementalAffinity: { Physical: 0.8, Magic: 1.2 }
    };
  } else {
    // Regular enemies
    const names = ["Goblin", "Wolf", "Skeleton", "Orc", "Witch", "Minotaur", "Harpy", "Necromancer", "Troll", "Dragonkin"];
    ENEMIES[i] = {
      name: names[(i - 1) % names.length],
      baseStats: { 
        HP: (60 + i * 10) * scale, 
        MP: (20 + i * 5) * scale, 
        ATK: (8 + i * 1.5) * scale, 
        DEF: (5 + i * 0.8) * scale, 
        MAT: (5 + i * 1.2) * scale, 
        MDF: (5 + i * 1.0) * scale 
      },
      elementalAffinity: { Physical: 1.0 }
    };
  }
}

// Character Class with Leveling
class Character {
  constructor(name, baseStats, growthRates = {}, scalars = {}, skills = [], elementalAffinity = {}) {
    this.name = name;
    this.baseStats = baseStats;
    this.growthRates = growthRates;
    this.scalars = scalars;
    this.skills = skills;
    this.elementalAffinity = elementalAffinity;
    this.level = 1;
    this.exp = 0;
    this.maxExp = 100; // Linear: 100 * level
    this.currentHP = this.calculateStat("HP");
    this.currentMP = this.calculateStat("MP");
    this.maxHP = this.currentHP;
    this.maxMP = this.currentMP;
    this.buffs = {};
    this.debuffs = {};
    this.effects = [];
  }

  calculateStat(stat) {
    const base = this.baseStats[stat] || 0;
    const growth = (this.growthRates[stat] || 0) * (this.level - 1); // Growth starts after L1
    const scalar = this.scalars[stat] || 1.0;
    const buff = this.buffs[stat] || 0;
    const debuff = this.debuffs[stat] || 0;
    return Math.max((base + growth) * scalar + buff - debuff, 1);
  }

  takeDamage(damage, element = "Physical") {
    const multiplier = this.elementalAffinity[element] || 1.0;
    const actualDamage = Math.max(damage * multiplier, 0);
    this.currentHP = Math.max(this.currentHP - actualDamage, 0);
    logMessage(`${this.name} took ${actualDamage.toFixed(1)} ${element} damage!`, "damage");
    if (this.currentHP <= 0) {
      logMessage(`${this.name} has been defeated!`, "defeated");
    }
    updateUI();
  }

  useSkill(skill, target) {
    if (skill.costType === "MP" && this.currentMP < skill.cost) {
      logMessage(`Not enough MP to use ${skill.name}!`, "info");
      return false;
    }

    if (skill.costType === "MP") this.currentMP -= skill.cost;

    logMessage(`${this.name} uses ${skill.name}!`, "info");

    if (skill.type === "damage") {
      const damage = this.calculateDamage(skill, target);
      target.takeDamage(damage, skill.element || "Physical");
    } else if (skill.type === "heal") {
      const healAmount = skill.baseHeal + 
        (this.calculateStat("ATK") || 0) * (skill.atkScale || 0) +
        (this.calculateStat("MAT") || 0) * (skill.matScale || 0);
      this.currentHP = Math.min(this.currentHP + healAmount, this.maxHP);
      logMessage(`${this.name} healed for ${healAmount.toFixed(1)} HP!`, "heal");
      updateUI();
    } else if (skill.type === "buff") {
      this.buffs[skill.stat] = (this.buffs[skill.stat] || 0) + skill.value;
      this.effects.push({ type: "buff", stat: skill.stat, value: skill.value, duration: skill.duration || 1 });
      logMessage(`${this.name} gained ${skill.value} ${skill.stat}!`, "info");
    } else if (skill.type === "debuff") {
      target.debuffs[skill.targetStat] = (target.debuffs[skill.targetStat] || 0) + skill.reduceBy;
      target.effects.push({ type: "debuff", stat: skill.targetStat, value: skill.reduceBy, duration: skill.duration || 1 });
      logMessage(`${target.name}'s ${skill.targetStat} reduced by ${skill.reduceBy}!`, "damage");
    }
    return true;
  }

  calculateDamage(skill, target) {
    const atk = (this.calculateStat("ATK") || 0) * (skill.atkScale || 0);
    const mat = (this.calculateStat("MAT") || 0) * (skill.matScale || 0);
    const def = (target.calculateStat("DEF") || 0) * (skill.defScale || 0);
    const mdef = (target.calculateStat("MDF") || 0) * (skill.mdfScale || 0);
    const raw = Math.max((atk + mat) - (def + mdef), 0);
    const crit = Math.random() < (this.calculateStat("LUK") || 5) / 100 ? 1.5 : 1.0;
    return raw * crit;
  }

  gainExp(amount) {
    this.exp += amount;
    logMessage(`${this.name} gained ${amount} EXP!`, "info");
    
    while (this.exp >= this.maxExp && this.level < 10) {
      this.levelUp();
    }
    updateUI();
  }

  levelUp() {
    this.exp -= this.maxExp;
    this.level++;
    this.maxExp = 100 * this.level; // Next level requirement
    
    // Restore resources on level up
    this.currentHP = this.calculateStat("HP");
    this.currentMP = this.calculateStat("MP");
    this.maxHP = this.currentHP;
    this.maxMP = this.currentMP;
    
    logMessage(`🎉 ${this.name} reached Level ${this.level}!`, "info");
  }

  endTurn() {
    // Reduce effect durations
    this.effects = this.effects.filter(effect => {
      effect.duration--;
      if (effect.duration <= 0) {
        if (effect.type === "buff") {
          this.buffs[effect.stat] = Math.max((this.buffs[effect.stat] || 0) - effect.value, 0);
        } else if (effect.type === "debuff") {
          this.debuffs[effect.stat] = Math.max((this.debuffs[effect.stat] || 0) - effect.value, 0);
        }
        return false;
      }
      return true;
    });
  }
}

// Utility Functions
function logMessage(msg, type = "info") {
  const div = document.createElement("div");
  div.textContent = msg;
  div.className = type;
  document.getElementById("battleLog").appendChild(div);
  document.getElementById("battleLog").scrollTop = document.getElementById("battleLog").scrollHeight;
}

function updateUI() {
  if (!player) return;

  // Only update battle stats if enemy exists
  if (enemy) {
    document.getElementById("playerHP").textContent = player.currentHP.toFixed(0);
    document.getElementById("playerMaxHP").textContent = player.maxHP.toFixed(0);
    document.getElementById("playerMP").textContent = player.currentMP.toFixed(0);
    document.getElementById("playerMaxMP").textContent = player.maxMP.toFixed(0);
    document.getElementById("playerHPBar").style.width = `${(player.currentHP / player.maxHP) * 100}%`;
    document.getElementById("playerMPBar").style.width = `${(player.currentMP / player.maxMP) * 100}%`;

    document.getElementById("enemyHP").textContent = enemy.currentHP.toFixed(0);
    document.getElementById("enemyMaxHP").textContent = enemy.maxHP.toFixed(0);
    document.getElementById("enemyMP").textContent = enemy.currentMP.toFixed(0);
    document.getElementById("enemyMaxMP").textContent = enemy.maxMP.toFixed(0);
    document.getElementById("enemyHPBar").style.width = `${(enemy.currentHP / enemy.maxHP) * 100}%`;
    document.getElementById("enemyMPBar").style.width = `${(enemy.currentMP / enemy.maxMP) * 100}%`;

    document.getElementById("attackChoice").disabled = !playerTurn || player.currentHP <= 0 || enemy.currentHP <= 0;
    document.getElementById("skillChoice").disabled = !playerTurn || player.currentHP <= 0 || enemy.currentHP <= 0 || player.currentMP < 15;
    document.getElementById("defendChoice").disabled = !playerTurn || player.currentHP <= 0 || enemy.currentHP <= 0;
  }
  // If no enemy, only player stats could be shown (e.g., on stage map),
  // but we don't currently display them outside battle.
}

function startBattle(stageNum) {
  currentStage = stageNum;
  const enemyData = ENEMIES[stageNum];
  
  enemy = new Character(
    enemyData.name,
    enemyData.baseStats,
    {},
    {},
    [],
    enemyData.elementalAffinity
  );

  // Reset player for new battle
  player.currentHP = player.maxHP;
  player.currentMP = player.maxMP;
  playerTurn = true;
  player.buffs = {};
  player.debuffs = {};
  player.effects = [];

  // Clear log
  const logEl = document.getElementById("battleLog");
  logEl.innerHTML = `<div class="info">Battle started! Facing ${enemy.name}.</div>`;

  document.getElementById("battleTitle").textContent = `Stage: ${stageNum}`;
  updateUI();
  showScreen("battleScreen");
}

function unlockNextStage(stageNum) {
  const nextStage = parseInt(stageNum) + 1;
  if (nextStage <= 12) {
    const node = document.querySelector(`[data-stage="${nextStage}"]`);
    if (node) {
      node.classList.remove("stage-locked");
      node.classList.add("stage-available");
    }
    completedStages.add(stageNum);
    updateProgress();
  }
}

function updateProgress() {
  const totalStages = 12;
  const completedCount = completedStages.size;
  const percent = (completedCount / totalStages) * 100;
  document.getElementById("progressFill").style.width = `${percent}%`;
}

function checkBattleEnd() {
  if (player.currentHP <= 0 || enemy.currentHP <= 0) {
    const winner = player.currentHP > 0 ? "You" : "The Enemy";
    logMessage(`🏆 ${winner} wins!`, "info");

    setTimeout(() => {
      if (winner === "You") {
        // Grant EXP based on enemy stage
        const expGained = 30 + currentStage * 10;
        player.gainExp(expGained);

        // Unlock next stage
        unlockNextStage(currentStage);
        const node = document.querySelector(`[data-stage="${currentStage}"]`);
        if (node) {
          node.classList.remove("stage-available", "stage-boss");
          node.classList.add("stage-completed");
        }
      }

      showScreen("stageMap");
    }, 1800);

    playerTurn = false;
  }
}

function endPlayerTurn() {
  playerTurn = false;
  player.endTurn(); // Clear buffs/debuffs that expired

  setTimeout(() => {
    if (enemy.currentHP <= 0 || player.currentHP <= 0) return;

    // Enemy AI
    const damage = Math.max(enemy.calculateStat("ATK") - player.calculateStat("DEF"), 5);
    player.takeDamage(damage, "Physical");

    // Check after enemy attack
    checkBattleEnd();

    if (player.currentHP > 0 && enemy.currentHP > 0) {
      playerTurn = true;
      updateUI();
    }
  }, 800);
}

// Navigation
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// Event Listeners
document.getElementById("startBtn").addEventListener("click", () => {
  showScreen("classSelect");
});

document.getElementById("backToMain").addEventListener("click", () => {
  showScreen("mainMenu");
});

document.getElementById("backToClass").addEventListener("click", () => {
  showScreen("classSelect");
});

document.getElementById("backToMap").addEventListener("click", () => {
  showScreen("stageMap");
});

// Class Selection
document.querySelectorAll(".class-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    try {
      currentClass = btn.dataset.class;
      const cls = CLASSES[currentClass];

      player = new Character(
        cls.name,
        cls.baseStats,
        cls.growthRates,
        cls.scalars,
        cls.skills,
        cls.elementalAffinity
      );

      showScreen("stageMap");
    } catch (err) {
      console.error("Error selecting class:", err);
      alert("Failed to load class. Check console for errors.");
    }
  });
});

// Stage Selection
document.querySelectorAll(".stage-node").forEach(node => {
  node.addEventListener("click", () => {
    if (node.classList.contains("stage-locked")) return;
    startBattle(node.dataset.stage);
  });
});

// Battle Actions
document.getElementById("attackChoice").addEventListener("click", () => {
  if (playerTurn && player.currentHP > 0 && enemy.currentHP > 0) {
    const skill = player.skills.find(s => s.type === "damage") || player.skills[0];
    player.useSkill(skill, enemy);
    checkBattleEnd();
    if (enemy.currentHP > 0) {
      endPlayerTurn();
    }
  }
});

document.getElementById("skillChoice").addEventListener("click", () => {
  if (playerTurn && player.currentHP > 0 && enemy.currentHP > 0) {
    // Open skill selection? For now, use 2nd skill
    const skill = player.skills[1] || player.skills[0];
    if (player.currentMP >= skill.cost) {
      player.useSkill(skill, enemy);
      checkBattleEnd();
      if (enemy.currentHP > 0) {
        endPlayerTurn();
      }
    } else {
      logMessage("Not enough MP!", "info");
    }
  }
});

document.getElementById("defendChoice").addEventListener("click", () => {
  if (playerTurn && player.currentHP > 0 && enemy.currentHP > 0) {
    player.buffs["DEF"] = (player.buffs["DEF"] || 0) + 12;
    logMessage(`${player.name} braces for impact! DEF +12`, "info");
    endPlayerTurn();
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Ensure only Stage 1 is available
  for (let i = 2; i <= 12; i++) {
    const node = document.querySelector(`[data-stage="${i}"]`);
    if (node) node.classList.add("stage-locked");
  }
  updateProgress();
});