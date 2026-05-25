
//import "../styles/global.css"

export async function getServerSideProps() {
    return {
      props: {
        message: "SSR Working",
      },
    };
  }
  
  export default function Home({ message }) {
    return <h1>{message}</h1>;
  }