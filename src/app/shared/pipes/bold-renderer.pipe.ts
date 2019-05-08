import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boldRenderer'
})
export class BoldRendererPipe implements PipeTransform {

  // transform [] to bold
  transform(content: string): string {
    console.log('BoldRendererPipe | transform')
    let openBracketStack = [];
    let boldText = '';
    let text = '';
    let i = 0;
    while (i < content.length) {
      let char = content[i];
      if (char === '[') {
        openBracketStack.push(char)
        let j = i + 1;
        let lastCloseBracketIndex = -1;
        while (j < content.length) {
          let charJ = content[j]
          if (charJ === ']') {
            lastCloseBracketIndex = j;
            if (openBracketStack.length > 0) {
              openBracketStack.pop();
            }
          } else if (charJ === '[') {
            if (lastCloseBracketIndex === -1) {
              openBracketStack.push(charJ);
            } else if (openBracketStack.length === 0) {
              break;
            }
          }
          j += 1;
        }
        if (lastCloseBracketIndex > -1) {
          openBracketStack = [];
          text += '<b>' + content.substring(i + 1, lastCloseBracketIndex) + '</b>'
          i = lastCloseBracketIndex + 1;
        } else {
          text += '[' + content.substring(i + 1, content.length)
          openBracketStack = [];
          i = content.length;
        }
      } else {
        text += char;
        i += 1;
      }
    }
    return text;
  }

}
