const ITEM_BAR_WIDTH = 500;

class DefaultMap extends Map {
  constructor(defaultValue) {
    super();
    this.defaultValue = defaultValue;
  }

  get(key) {
    if (this.has(key)) {
      return super.get(key);
    }

    return this.defaultValue;
  }
}

class Histogram {
  constructor(form, output) {
    this.form = form;
    this.output = output;
    this.textInput = this.form.querySelector('textarea');
    this.histogramList = this.output.querySelector('.histogram-output__list');
    this.letterCounts = new DefaultMap(0);
    this.clear();
  }

  init() {
    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();

      this.parse(this.textInput.value);
      this.refresh();
    });

    this.form.addEventListener('reset', () => {
      this.clear();
    });
  }

  clear() {
    this.letterCounts.clear();
    this.totalLetters = 0;
    this.histogramList.textContent = '';
  }

  parse(text) {
    this.letterCounts.clear();
    this.totalLetters = 0;

    text = text.replace(/\s/g, '').toUpperCase();
    for (let character of text) {
      let count = this.letterCounts.get(character);
      this.letterCounts.set(character, count + 1);
      this.totalLetters++;
    }
  }

  refresh() {
    this.histogramList.textContent = '';
    let entries = [...this.letterCounts];

    entries
        .sort((a, b) => {
          if (a[1] === b[1]) {
            return a[0] < b[0] ? -1 : 1;
          }

          return b[1] - a[1];
        })
        .forEach((entry) => {
          entry[1] = entry[1] / this.totalLetters * 100;
        });
    entries = entries.filter((entry) => entry[1] >= 1);
    const newItemsList = entries.map(([letter, percent]) => {
      const newItem = document.createElement('li');
      newItem.classList.add('histogram-item');
      const newItemInner = document.createElement('div');
      newItemInner.classList.add('histogram-item__inner');
      newItem.appendChild(newItemInner);
      const newItemLetter = document.createElement('span');
      newItemLetter.classList.add('histogram-item__letter');
      newItemLetter.textContent = `${letter}:`;
      newItemInner.appendChild(newItemLetter);
      const newItemBar = document.createElement('div');
      newItemBar.classList.add('histogram-item__bar');
      newItemInner.appendChild(newItemBar);
      const newItemValue = document.createElement('div');
      newItemValue.classList.add('histogram-item__value');
      newItemValue.setAttribute('style', `width: ${Math.round(percent * ITEM_BAR_WIDTH / 100)}px;`);
      newItemBar.appendChild(newItemValue);
      const newItemPercent = document.createElement('span');
      newItemPercent.classList.add('histogram-item__percent');
      newItemPercent.textContent = `${percent.toFixed(2)}%`;
      newItemInner.appendChild(newItemPercent);

      return newItem;
    });

    const itemListFragment = document.createDocumentFragment();
    newItemsList.forEach((newItem) => itemListFragment.append(newItem));
    this.histogramList.append(itemListFragment);
  }
}

export {Histogram};
