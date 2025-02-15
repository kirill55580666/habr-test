export interface ISuggestMention {
  type: "company" | "user";
  alias: string;
  name: string;
  avatar: string | null;
}

//TODO был бы axios не передавал бы так убого квери параметры и навесил бы интерсептор на ошибки (какой нибудь красивый тостер)
export const suggestMention = (search: string): Promise<ISuggestMention[]> =>
  fetch(
    "https://habr.com/kek/v2/publication/suggest-mention?" +
      new URLSearchParams({ q: search })
  )
    .then<{ data: ISuggestMention[] }>((res) => res.json())
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err);
    });
