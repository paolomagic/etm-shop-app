import gql from "graphql-tag";

const getProductBySku = async (client, query) => {
    return gql`
        query($query:String!) {
            productVariants(query:$query, first: 15) {
                edges {
                    node {
                        product {
                            id
                            title
                            vendor
                        }
                    }
                }
            }
        }
    `
};

export default getProductBySku;
