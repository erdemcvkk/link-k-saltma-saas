const fs = require('fs');
let code = fs.readFileSync('src/app/actions.ts', 'utf-8');

const saveAddonLogic = `  const updated = await db.userAddon.update({
    where: { id: addonId },
    data: { 
      config: configJson,
      ...(isActive !== undefined ? { isActive } : {})
    }
  });`;

const newSaveAddonLogic = `  const updated = await db.userAddon.update({
    where: { id: addonId },
    data: { 
      config: configJson,
      ...(isActive !== undefined ? { isActive } : {})
    }
  });

  // If this addon is being activated, deactivate all other addons for the user
  if (isActive === true) {
    await db.userAddon.updateMany({
      where: { userId: user.id, id: { not: addonId } },
      data: { isActive: false }
    });
  }`;

if (code.includes(saveAddonLogic)) {
  code = code.replace(saveAddonLogic, newSaveAddonLogic);
  fs.writeFileSync('src/app/actions.ts', code, 'utf-8');
  console.log("actions.ts updated for exclusive addon activation");
} else {
  console.log("Could not find saveAddonLogic in actions.ts");
}
