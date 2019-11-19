import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PurchaseableItem from "./PurchaseableItem";
import ShopItem from "./ShopItem";
import { shopRefundRequest, shopPurchaseRequest, shopConfirmPurchase } from "../../redux/actions";
import { TYPE_OWNERS, TYPE_AIR, TYPE_LAND, TYPE_SEA, TYPE_SPECIAL, LIST_ALL_CAPABILITIES } from "../../constants/gameConstants";

const shopStyle = {
    backgroundColor: "Yellow",
    position: "absolute",
    height: "225%",
    width: "1800%",
    marginLeft: "150%",
    marginTop: "20%"
};

const invisibleStyle = {
    display: "none"
};

const purchaseButtonStyle = {
    position: "absolute",
    bottom: "1%",
    right: "1%",
    height: "5%",
    width: "10%",
    backgroundColor: "pink"
};

const purchaseableItemsContainerStyle = {
    backgroundColor: "red",
    position: "relative",
    width: "15%",
    height: "80%",
    float: "left",
    top: "2.5%",
    margin: ".5%"
};

class ShopMenu extends Component {
    render() {
        const { shopItems, selected, purchase, refund, points, confirmPurchase } = this.props;

        const airShopComponents = TYPE_OWNERS[TYPE_AIR].map((typeId, index) => <PurchaseableItem key={index} purchase={purchase} typeId={typeId} />);
        const landShopComponents = TYPE_OWNERS[TYPE_LAND].map((typeId, index) => <PurchaseableItem key={index} purchase={purchase} typeId={typeId} />);
        const seaShopComponents = TYPE_OWNERS[TYPE_SEA].map((typeId, index) => <PurchaseableItem key={index} purchase={purchase} typeId={typeId} />);
        const specialShopComponents = TYPE_OWNERS[TYPE_SPECIAL].map((typeId, index) => <PurchaseableItem key={index} purchase={purchase} typeId={typeId} />);
        const capabilityShopComponents = LIST_ALL_CAPABILITIES.map((typeId, index) => <PurchaseableItem key={index} purchase={purchase} typeId={typeId} />);

        const shopItemComponents = shopItems.map((shopItem, index) => <ShopItem key={index} shopItem={shopItem} refund={shopItemId => refund(shopItemId)} />);

        return (
            <div style={selected ? shopStyle : invisibleStyle}>                
                <div>Shop Menu</div>
                <div>Points: {points}</div>
                <div style={purchaseableItemsContainerStyle}>
                    <div>Air</div>
                    {airShopComponents}
                </div>
                <div style={purchaseableItemsContainerStyle}>
                    <div>Land</div>
                    {landShopComponents}
                </div>
                <div style={purchaseableItemsContainerStyle}>
                    <div>Maritime</div>
                    {seaShopComponents}
                </div>
                <div style={purchaseableItemsContainerStyle}>
                    <div>SOF</div>
                    {specialShopComponents}
                </div>
                <div style={purchaseableItemsContainerStyle}>
                    <div>Capabilities</div>
                    {capabilityShopComponents}
                </div>
                <div style={purchaseableItemsContainerStyle}>
                    <div>Cart</div>
                    {shopItemComponents}
                </div>
                <div
                    style={purchaseButtonStyle}
                    onClick={event => {
                        event.preventDefault();
                        confirmPurchase();
                        event.stopPropagation();
                    }}
                >
                    Confirm Purchase
                </div>
            </div>
        );
    }
}

ShopMenu.propTypes = {
    shopItems: PropTypes.array.isRequired,
    selected: PropTypes.bool.isRequired, //from parent
    purchase: PropTypes.func.isRequired,
    refund: PropTypes.func.isRequired,
    points: PropTypes.number.isRequired,
    confirmPurchase: PropTypes.func.isRequired
};

const mapStateToProps = ({ shopItems, gameInfo }) => ({
    shopItems: shopItems,
    points: gameInfo.gamePoints
});

const mapActionsToProps = {
    purchase: shopPurchaseRequest,
    refund: shopRefundRequest,
    confirmPurchase: shopConfirmPurchase
};

export default connect(mapStateToProps, mapActionsToProps)(ShopMenu);
