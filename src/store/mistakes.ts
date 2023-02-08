import { defineStore } from "pinia";

import { storage_get, storage_set } from '@/util';
import { Question } from "@/question";

interface MistakeQuestion {
  problem: string,
  correctAnswer: string,
  time: string,
  duration: number,
  wrongAnswers: string[],
}

export default defineStore("mistakes", () => {
  const MISTAKE_BUCKET = 50;

  const enum MistakesStorageKeys {
    Count = "OC_MistakesCount",
    Questions = "OC_MistakesQuestions",
  }

  function get_items_count(): number {
    let itemsCount = parseInt(storage_get(MistakesStorageKeys.Count, "0"));
    return itemsCount;
  }

  function get_mistakes(): MistakeQuestion[] {
    let ans = [] as MistakeQuestion[];
    let itemsCount = get_items_count();
    for (let i = 1; i <= itemsCount; ++i) {
      try {
        let s = storage_get(`${MistakesStorageKeys.Questions}_${i}`, "[]");
        let mistakeQuestions = JSON.parse(s) as MistakeQuestion[];
        for (let q of mistakeQuestions)
          ans.push(q);
      } catch (e) {
        console.error(e);
      }
    }
    return ans;
  }

  function append_mistake(mistake: Question): void {
    let itemsCount = get_items_count();
    let key = `${MistakesStorageKeys.Questions}_${itemsCount}`;
    try {
      let mistakeQuestions = JSON.parse(storage_get(
        key, "[]"
      )) as MistakeQuestion[];
      if (localStorage.getItem(key) === null)
        ++itemsCount;
      let q: MistakeQuestion = {
        problem: mistake.problem,
        correctAnswer: mistake.correctAnswer,
        time: mistake.start.toLocaleString(),
        duration: mistake.get_duration(),
        wrongAnswers: [...mistake.wrongAnswers],
      }
      if (mistakeQuestions.length >= MISTAKE_BUCKET) {
        // key changed
        ++itemsCount;
        storage_set(MistakesStorageKeys.Count, itemsCount.toString());
        storage_set(`${MistakesStorageKeys.Questions}_${itemsCount}`, JSON.stringify([q]));
      } else {
        mistakeQuestions.push(q);
        storage_set(key, JSON.stringify(mistakeQuestions));
      }
    } catch (e) {
      console.error(e);
    }
  }

  function clear_mistakes() {
    let itemsCount = get_items_count();
    for (let i = 1; i <= itemsCount; ++i)
      localStorage.removeItem(`${MistakesStorageKeys.Questions}_${i}`);
    storage_set(MistakesStorageKeys.Count, "0");
  }

  return {
    get_mistakes,
    append_mistake,
    clear_mistakes,
  };
});
