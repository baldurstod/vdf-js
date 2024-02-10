import fs from 'fs/promises';
import { parse } from './index.js';

//parseVDF('./var/player_card_template.txt');
//parseVDF('./var/items_game.txt');
parseVDF('./var/mvm_popfile.pop');

async function parseVDF(filePath) {
	const contents = await fs.readFile(filePath/*, { encoding: 'utf8' }*/);
	const res = parse(String(contents));

	console.info(JSON.stringify(res));
	console.info(res);
}
