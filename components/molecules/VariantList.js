import {ResourceList, TextStyle, ButtonGroup, Button, TextField} from "@shopify/polaris";
import React, {useState, useEffect} from "react";
import VariantItemLazy from "./VariantItemLazy";
import {useRouter} from "next/router";

const VariantList = ({existingProduct}) => {
    const router = useRouter();
    const [variants, setVariants] = useState([]);

    const productId = router.query.id;
    const variantsCount = existingProduct?.product?.variantsCount?.count;

    useEffect(() => {
        if (variantsCount && (variants.length < variantsCount)) {
            let lastVariant = null;
            if (variants.length) {
                lastVariant = {
                    ...variants[variants.length - 1]
                };
            }
            fetchVariants(5, lastVariant?.cursor);
        }
    }, [variants, variantsCount]);

    if (!variantsCount) {
        return null;
    }

    const fetchVariants = async (limit, after) => {
        try {
            let body = {
                productId: productId,
                limit: limit,
                pkgSize: "small"
            };
            if (after) {
                body.cursor = after;
            }
            let data = await fetch("/product/variants/", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }).then(response => response.json());
            if (data.length) {
                setVariants([...variants, ...data])
            }
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <div className="Polaris-ResourceList__ResourceListWrapper">
            <div className="Polaris-ResourceList__HeaderOuterWrapper">
                <div>
                    <div style={{paddingBottom: "0px"}}></div>
                    <div>
                        <div className="Polaris-ResourceList__HeaderWrapper">
                            <div className="Polaris-ResourceList__HeaderContentWrapper">
                                <div className="Polaris-ResourceList__HeaderTitleWrapper">{variantsCount} Varianten</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul className="Polaris-ResourceList">
                {variants.map((item, i) => <VariantItemLazy item={item} key={"lazy-item-" + i} />)}
            </ul>
        </div>
    );
};

export default VariantList;
