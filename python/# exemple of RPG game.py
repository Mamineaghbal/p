import random
from typing import Dict, List, Optional

class Character:
    def __init__(
        self,
        name: str,
        faction: str = "neutral",
        level: int = 1,
        base_stats: Dict[str, float] = None,
        growth_rates: Dict[str, float] = None,
        scalars: Dict[str, float] = None,
        skills: List[Dict] = None,
        elemental_affinity: Dict[str, float] = None,
        is_playable: bool = False
    ):
        self.name = name
        self.faction = faction
        self.is_playable = is_playable
        self.level = level
        
        # Stats initialization
        self.base_stats = base_stats or {"HP": 100, "MP": 50, "ATK": 10, "DEF": 10}
        self.growth_rates = growth_rates or {stat: 0 for stat in self.base_stats}
        self.scalars = scalars or {stat: 1.0 for stat in self.base_stats}
        self.buffs: Dict[str, float] = {}
        
        # Resource initialization
        self.current_hp = self.calculate_stat("HP")
        self.current_mp = self.calculate_stat("MP")
        self.sp = 0
        self.effects: List[Dict] = []
        
        # Progression
        self.exp = 0
        self.max_exp = self.calculate_max_exp()
        
        # Combat abilities
        self.skills = skills or []
        self.elemental_affinity = elemental_affinity or {"Physical": 1.0, "Magic": 1.0}

    def calculate_stat(self, stat: str) -> float:
        base = self.base_stats.get(stat, 0)
        growth = self.growth_rates.get(stat, 0) * self.level
        scalar = self.scalars.get(stat, 1.0)
        buff = self.buffs.get(stat, 1.0)
        return (base + growth) * scalar * buff

    def calculate_max_exp(self) -> float:
        # Linear progression by default
        return 100 * self.level

    def take_damage(self, damage: float, element: str = "Physical"):
        multiplier = self.elemental_affinity.get(element, 1.0)
        actual_damage = max(damage * multiplier, 0)
        self.current_hp -= actual_damage
        print(f"{self.name} took {actual_damage:.1f} {element} damage!")
        if self.current_hp <= 0:
            print(f"{self.name} has been defeated!")
            self.current_hp = 0

    def use_skill(self, skill: Dict, targets: List['Character']):
        # Check resource availability
        resource = skill['cost_type']
        cost = skill['cost']
        if (resource == "MP" and self.current_mp < cost) or (resource == "SP" and self.sp < cost):
            print(f"Not enough {resource} to use {skill['name']}!")
            return False

        # Deduct cost
        if resource == "MP":
            self.current_mp -= cost
        else:
            self.sp -= cost

        # Apply skill effects
        print(f"{self.name} uses {skill['name']}!")
        for target in targets:
            if skill['type'] == "damage":
                damage = self.calculate_damage(skill, target)
                target.take_damage(damage, skill.get('element', 'Physical'))
            elif skill['type'] == "heal":
                heal_amount = self.calculate_heal(skill)
                target.current_hp = min(target.current_hp + heal_amount, target.calculate_stat("HP"))
                print(f"{target.name} healed for {heal_amount:.1f} HP!")

        return True

    def calculate_damage(self, skill: Dict, target: 'Character') -> float:
        atk = self.calculate_stat("ATK") * skill.get('atk_scale', 0)
        mat = self.calculate_stat("MAT") * skill.get('mat_scale', 0)
        defense = target.calculate_stat("DEF") * skill.get('def_scale', 0)
        mdef = target.calculate_stat("MDF") * skill.get('mdf_scale', 0)
        
        raw_damage = max((atk + mat) - (defense + mdef), 0)
        crit_chance = self.calculate_stat("LUK") / 100
        crit_multiplier = 1.5 if random.random() < crit_chance else 1.0
        return raw_damage * crit_multiplier

    def calculate_heal(self, skill: Dict) -> float:
        base_heal = skill['base_heal']
        mat_scale = skill.get('mat_scale', 0)
        return base_heal + self.calculate_stat("MAT") * mat_scale

    def update_effects(self):
        for effect in self.effects:
            effect['duration'] -= 1
        self.effects = [e for e in self.effects if e['duration'] > 0]

    def gain_exp(self, amount: float):
        if not self.is_playable:
            return
            
        self.exp += amount
        print(f"{self.name} gained {amount} EXP!")
        while self.exp >= self.max_exp:
            self.level_up()

    def level_up(self):
        self.level += 1
        self.exp -= self.max_exp
        self.max_exp = self.calculate_max_exp()
        print(f"{self.name} reached level {self.level}!")
        
        # Restore resources on level up
        self.current_hp = self.calculate_stat("HP")
        self.current_mp = self.calculate_stat("MP")

# Example Skills
BASIC_ATTACK = {
    "name": "Attack",
    "cost_type": "MP",
    "cost": 0,
    "type": "damage",
    "atk_scale": 1.0,
    "def_scale": 0.5
}

FIREBALL = {
    "name": "Fireball",
    "cost_type": "MP",
    "cost": 15,
    "type": "damage",
    "mat_scale": 1.2,
    "mdf_scale": 0.3,
    "element": "Fire"
}

HEAL = {
    "name": "Heal",
    "cost_type": "MP",
    "cost": 20,
    "type": "heal",
    "base_heal": 30,
    "mat_scale": 0.5
}

# Demo Combat
if __name__ == "__main__":
    # Create characters
    hero = Character(
        name="Valor",
        faction="player",
        is_playable=True,
        base_stats={"HP": 120, "MP": 40, "ATK": 15, "DEF": 12, "MAT": 8, "MDF": 10},
        growth_rates={"HP": 12, "ATK": 2, "DEF": 1.5},
        scalars={"ATK": 1.3},
        skills=[BASIC_ATTACK, HEAL],
        elemental_affinity={"Fire": 0.8}
    )

    enemy = Character(
        name="Fire Imp",
        faction="enemy",
        base_stats={"HP": 80, "MP": 30, "ATK": 10, "DEF": 8, "MAT": 18, "MDF": 6},
        scalars={"MAT": 1.5},
        skills=[FIREBALL],
        elemental_affinity={"Fire": 1.2, "Ice": 0.7}
    )

    # Combat loop
    print("\n=== BATTLE START ===")
    while hero.current_hp > 0 and enemy.current_hp > 0:
        # Hero's turn
        print(f"\n[Valor's Turn] HP: {hero.current_hp:.1f}, MP: {hero.current_mp:.1f}")
        hero.use_skill(HEAL, [hero])  # Heal self
        hero.use_skill(BASIC_ATTACK, [enemy])

        # Enemy's turn
        if enemy.current_hp > 0:
            print(f"\n[Fire Imp's Turn] HP: {enemy.current_hp:.1f}")
            enemy.use_skill(FIREBALL, [hero])

    print("\n=== BATTLE END ===")
    print(f"Hero HP: {hero.current_hp:.1f}")
    print(f"Enemy HP: {enemy.current_hp:.1f}")


