import { Injectable } from '@nestjs/common';

@Injectable()
export class JustifyService {
    // Justifie un texte en ajoutant des espaces entre les mots.
    justifyText(text: string, lineLength: number = 80): string {
        const words = text.split(/\s+/);
        let result = '';
        let line = '';

        // Parcourir chaque mot et les ajouter à la ligne.
        words.forEach((word) => {
            if ((line + word).length > lineLength) {
                result += this.justifyLine(line.trim(), lineLength) + '\n';
                line = '';
            }
            line += word + ' ';
        });

        // Dernière ligne, ne pas justifier.
        if (line.trim().length > 0) {
            result += line.trim();
        }

        return result;
    }

    // Justifie une ligne de texte.
    private justifyLine(line: string, lineLength: number): string {
        const words = line.split(' ');
        const totalSpaces = lineLength - line.replace(/ /g, '').length;

        // Si la ligne ne contient qu'un mot, ne pas justifier.
        if (words.length === 1) return words[0];

        // Calculer le nombre d'espaces entre chaque mot.
        let spaceBetweenWords = Math.floor(totalSpaces / (words.length - 1));
        let extraSpaces = totalSpaces % (words.length - 1);

        // Ajouter les espaces entre les mots.
        return words.reduce((result, word, index) => {
            if (index === words.length - 1) return result + word;
            const spaces = spaceBetweenWords + (extraSpaces > 0 ? 1 : 0);
            extraSpaces--;
            return result + word + ' '.repeat(spaces);
        }, '');
    }
}
