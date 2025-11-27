import axios from "axios";

export type NewsParams = {
    query?: string;
    language?: string;
    pageSize?: number;
    page?: number;
    sortBy?: "relevancy" | "popularity" | "publishedAt";
  };

  export async function getNews(params: NewsParams, apiKey: string) {
    const {
      query = "latest",
      language = "en",
      pageSize = 5,
      page = 1,
      sortBy = "publishedAt",
    } = params;
  
    if (!apiKey) throw new Error("NEWS_API_KEY is not defined");
  
    const url = `https://newsapi.org/v2/everything`;
  
    try {
      const response = await axios.get(url, {
        params: {
          q: query,
          language,
          pageSize,
          page,
          sortBy,
          apiKey,
        },
      });
  
      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
      }));
    } catch (error: any) {
      throw new Error(
        `News API request failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

