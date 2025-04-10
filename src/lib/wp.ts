const domain = import.meta.env.WP_DOMAIN;
const api = import.meta.env.WP_API;

// OBTENER INFORMACIÓN DE LA PAGINA QUE QUERAMOS POR MEDIO DEL SLUG, EN ESTE CASO LA DE BIENVENIDOS. O FRONT PAGE DE WORDPRESS

export const getPageInfo = async (slug: string) => {
 
 const response = await fetch(`${domain}/${api}/pages?slug=${slug}`);
 
  if (!response.ok) throw new Error("Failed to fetch data");
  const [data] = await response.json();
 
 /*  console.log(data[0].title.rendered);
  console.log(data[0].content.rendered); */
  // Destructuración de los datos para data es lo mismo que hacer data.title, data.content, etc.
const {title: {rendered: title}, content: {rendered: content}, yoast_head_json: seo} = data;

  return {title, content, seo};
 };

 // OBTENER LA INFORMACIÓN DE LOS ÚLTIMOS POSTS O ENTRADAS DE WORDPRESS, EN ESTE CASO EL POSTYPE 'POSTS', SE PUEDE UTILIZAR CUALQUIER POSTYPE.


// SE DEFINE EL TIPO POR SEPARADO
 type GetPostsParams = {
  postType?: string;
  posts_per_page?: number;
};

// Se define el tipo de datos que se obtendrá de la API

type PostFromAPI = {
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded: any;
  date: string;
  slug: string;
};

export const getPosts = async ({ postType, posts_per_page }: GetPostsParams) => {

  //PARAMETRO &_embed lo que hace es que nos va a mostrar todos los objetos incrustados de la api sin necesidad de volver a llamar a la api.

  const response = await fetch(`${domain}/${api}/${postType}?${posts_per_page}_&_embed`);
  if (!response.ok) throw new Error("Failed to fetch data");
  const results: PostFromAPI[] = await response.json(); 
  if (!results.length) throw new Error("No posts found");
 
  // OBTENEMOS LOS DATOS NECESARIOS DESTRUCTURADOS
  const posts = results.map((post) => {
    const { title: {rendered: title}, 
    excerpt: {rendered: excerpt}, 
    content: {rendered: content}, 
    date, slug} = post;

    //ACCEDEMOS A LA IMAGEN DESTACADA MÁS FÁCIL CON _embedded

    const feacturedImage = post._embedded['wp:featuredmedia'][0].source_url;
    ;
  
    return {title, excerpt, feacturedImage, content, date, slug}; 
    
    });

    return posts;
  };

export const getPostInfo = async (slug: string) => {

  const response = await fetch(`${domain}/${api}/posts?slug=${slug}`);
  
    if (!response.ok) throw new Error("Failed to fetch data");
    const [data] = await response.json();
    console.log(data);
  /*  console.log(data[0].title.rendered);
    console.log(data[0].content.rendered); */
    // Destructuración de los datos para data es lo mismo que hacer data.title, data.content, etc.
  const {title: {rendered: title}, content: {rendered: content}, yoast_head_json: seo} = data;
  
    return {title, content, seo};
  };


export const getAllPostsSlugs = async () => {
  const response = await fetch(`${domain}/${api}/posts?per_page=100`);
  if (!response.ok) throw new Error("Failed to fetch data");
  
  const results = await response.json();
 if (!results.length) throw new Error("No posts found");

 const slugs = results.map((post) => post.slug);
console.log(slugs);
 return slugs;
};