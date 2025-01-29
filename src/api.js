const USERNAME = process.env.REACT_APP_USERNAME;
const PASSWORD = process.env.REACT_APP_PASSWORD;

export const authenticate = async () => {
  try {
    const response = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: USERNAME,
        password: PASSWORD,
      }),
    });

    console.log("Response Status:", response.status); 
    console.log("Response Status Text:", response.statusText); 

    if (!response.ok) {
      const errorDetails = await response.text(); 
      throw new Error(`Erro na autenticação: ${errorDetails}`);
    }

    const data = await response.json();
    return data.accessJwt; 
  } catch (error) {
    console.error("Erro ao autenticar:", error);
    return null;
  }
};

export const createPostJson = (text) => {
  const postBody = {
    collection: "app.bsky.feed.post",
    repo: USERNAME, // Usando o handle constante
    record: {
      text: text,
      createdAt: new Date().toISOString(),
      $type: "app.bsky.feed.post",
    },
  };

  return postBody;
};

export const createPost = async (accessJwt, text) => {
  try {
    const postBody = createPostJson(text);
    
    const response = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessJwt}`,
      },
      body: JSON.stringify(postBody),
    });

    if (!response.ok) {
      const errorDetails = await response.text(); 
      throw new Error(`Erro ao criar o post: ${errorDetails}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao criar o post:", error);
    return null;
  }
};
