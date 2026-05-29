const fs = require('fs');
let code = fs.readFileSync('src/app/actions.ts', 'utf-8');

const purchaseLogic = `  return await db.userAddon.create({
    data: {
      userId: userId,
      addonType,
      isActive: true,
      config: JSON.stringify({ theme: defaultTheme })
    }
  });`;

const newPurchaseLogic = `  // Deactivate all other addons first to ensure only 1 active addon exists
  await db.userAddon.updateMany({
    where: { userId: userId },
    data: { isActive: false }
  });

  return await db.userAddon.create({
    data: {
      userId: userId,
      addonType,
      isActive: true,
      config: JSON.stringify({ theme: defaultTheme })
    }
  });`;

if (code.includes(purchaseLogic)) {
  code = code.replace(purchaseLogic, newPurchaseLogic);
  fs.writeFileSync('src/app/actions.ts', code, 'utf-8');
  console.log("actions.ts updated for purchase logic");
} else {
  console.log("Could not find purchaseLogic in actions.ts");
}
