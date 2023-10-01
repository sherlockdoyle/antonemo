# Antonemo

[Antonemo](https://sherlockdoyle.github.io/antonemo) is a fun and engaging game that challenges players to think of opposite words. It’s built with SolidJS, TailwindCSS, and DaisyUI. This project was primarily a learning experience for these technologies. The codebase is currently a mess with a mix of imperative and declarative code, duplicated states, no tests, and other issues. Improvements to the code will possibly be made in the future.

## The Game

In Antonemo, your goal is to discover the final word, which changes daily. A keyboard with a limited number of active keys (letters) is provided. The letters in the final word are highlighted in green on the keyboard, though they may initially be inactive.

You can form new words using only the active letters. If the word you create is in the word list, it will be underlined in green and you can add it to the board by pressing ‘ENTER’. If the word has an antonym, the antonym button next to the word will also become active. You can add the word along with its predefined antonym by pressing ‘ENTER’ or the antonym button.

Once a word (or its antonym) is added to the board, all letters in that word become active in the keyboard. Continue creating words until all letters for the final word are active. Then, you can form the final word and win the game!

## Word List Creation

The game utilizes three distinct word lists of varying sizes. While smaller lists offer more accuracy, they limit the choices available. Larger lists, on the other hand, provide a wider range of options but may contain errors.

### Data Collection

The words and their corresponding antonyms were gathered from a multitude of sources. All rights pertaining to the dataset and any relevant licenses remain with the original sources. The data was derived from:

1.  [word list](./src/assets/words.txt): This list of words was obtained from https://www.mit.edu/~ecprice/wordlist.10000. The words were then processed to remove plurals, select slang, and proper nouns.
2.  [thesaurus.json](./src/assets/thesaurus.json): Synonyms and antonyms for the words in the above list were sourced from https://api-ninjas.com/api/thesaurus.
3.  [antonyms.json](./src/assets/antonyms.json): This was retrieved from https://www.kaggle.com/datasets/duketemon/antonyms-wordnet.
4.  [eacl2017](./src/assets/eacl2017): This data was collected from https://www.ims.uni-stuttgart.de/en/research/resources/experiment-data/antonym-synonym-dataset/.
5.  [manual](./src/assets/manual.txt): Words were manually collected from https://en.wikipedia.org/wiki/Most_common_words_in_English and their antonyms were found using search engines.

The gathered words underwent further processing to eliminate words with two or fewer characters, plurals, proper nouns, and slang as much as possible. Antonyms consisting of multiple words were also removed.

### IOU

IOU (Intersection Over Union) or Jaccard Index is a important metric used in this game. This is a statistic used for gauging the similarity and diversity of sample sets. The IOU score of two words is calculated as follows:

```
IOU(A, B) = (number of letters common in A and B) / (total number of different letters in A and B)
```

If two words have a low IOU score, then they have more number of different letters. The higher the IOU score, the more similar the words are.

You can find all the code used to create the word lists in [`./src/assets/processor.ts`](./src/assets/processor.ts). The code that’s currently active is for the default word list. The code for the manual and large word list is there too, but it’s commented out.

### Manual word list (small)

For the manually created word list, we start by reading the file that was put together by hand. We then make a map that connects each word to a list of its possible antonyms. To organize this, we sort the antonyms for each word based on their IOU score (`IOU(word, antonym)`).

To break any ties during the sorting process, we use other measures. These include the number of new letters the antonym brings in and the average frequency of the antonym’s letters.

After sorting, we save this map with the organized lists of antonyms to a file ([`./src/assets/manual-processed.json`](./src/assets/manual-processed.json)). Then, we manually go through this processed file and remove any antonyms that don’t seem suitable, keeping at most 2 antonyms for each word.

### Default word list (medium)

For the default word list, we take the words and their antonyms from all the files we mentioned before. We combine all these lists into one big list. Then, we count how often each word shows up in all the files. We pick the 5000 words that show up the most. This helps us get rid of more slang words because they’re usually not as common.

Next, for each of these 5000 words, we pick two antonyms. One antonym with the lowest IOU score, and the other with the highest IOU score. If there’s a tie, we look at how many new letters the word brings in and how often the word shows up (word frequency, not letter frequency).

I later found out that the antonyms we got from api-ninjas (the second source I mentioned earlier) had a lot of errors. So, I only used these antonyms to count how often each word shows up. But when it came to choosing the final set of antonyms, I didn’t use them.

### Large word list

The large word list is made in a similar way to the default word list. The only differences are that we also include the antonyms from api-ninjas and all the synonyms. Plus, we don’t limit ourselves to 5000 words. We use all the words we have.

For each word, we pick up to two opposite words. The first opposite word has a low IOU score, which means it has many different letters compared to the original word. We use this for the easy mode. The second opposite word has a high IOU score, which means it has fewer different letters compared to the original word. We use this for the hard mode.

All the word lists are saved in their corresponding text file. The file contains a semicolon-separated list of comma-separated words and their antonyms. Each semicolon-separated section contains a word and none, one or two of its antonyms, comma-separated.

## Game Building Algorithm

First, we pick a word list as choosen. We then turn this list into a word graph, which is a map that connects each word to its opposites and each opposite to its original word. Depending on whether we’re in easy or hard mode, we pick the first or second opposite word. The easy opposite word gives us more new letters, while the hard opposite word gives us fewer new letters.

To build the game, we start by randomly picking an initial word. We could also pick more than one word or a random set of letters. Then, we select words from the word graph that can be made with our set of letters. We keep these words for later. For each word, we also take its opposite, if it has one.

We check the IOU score of the word-opposite pair with our original set of letters and randomly pick one of the pairs. But it’s not completely random - pairs with higher IOU scores have a better chance of being picked. Then, we add all the letters from this pair to our original set of letters.

We keep doing this until a certain percentage of the letters are active. Finally, we pick one of the words with the highest IOU score with our original set of letters as our final word. We also keep track of the words we randomly picked so we can build the solution path later.

## How to Run and Play

You can play the game online at: [https://sherlockdoyle.github.io/antonemo](https://sherlockdoyle.github.io/antonemo).

If you want to play the game on your own computer, you can run this Vite project. Here’s how:

1.  Install the necessary packages with `npm install`.
2.  Start the game with `npm run dev`.

The word lists you need for the game are already included in the project. But if you want, you can create your own word lists by following the instructions above. You could even make your own lists of synonyms and create a new game called Synonemo!
