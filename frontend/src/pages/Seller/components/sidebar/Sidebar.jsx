import "./sidebar.css";
import {
  LineStyle,
  Timeline,
  TrendingUp,
  PermIdentity,
  Storefront,
  AttachMoney,
  BarChart,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  WorkOutline,
  Report,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import UserContext from "context/BackendContext";
import { useContext } from "react";


export default function Sidebar() {

  const { user, logout } = useContext(UserContext)

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to='/seller/about' >

              {/* removed active here */}
              <li className="sidebarListItem ">

                <Timeline className="sidebarIcon" />
                Analytics
              </li>
            </Link>
            {/* <li className="sidebarListItem">
              <TrendingUp className="sidebarIcon" />
              Sales
            </li> */}
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/seller/products" className="link">
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                Products
              </li>
            </Link>
            <Link to="/seller/product/add" className="link">
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                Add product
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">About</h3>
          <ul className="sidebarList">
            <Link to="/about" className="link">
              <li className="sidebarListItem">
                <PermIdentity className="sidebarIcon" />
                Profile
              </li>
            </Link>
          </ul>
        </div>

        <button onClick={logout} class="w-24 rounded-lg shadow  m-auto bg-red-500 font-semibold hover:bg-red-600 py-3 text-sm text-white uppercase">Logout</button>

      </div>
    </div>
  );
}
