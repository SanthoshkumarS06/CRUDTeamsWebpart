import * as React from "react";
import {
  // BrowserRouter,
  // createBrowserRouter,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { DetailsList } from "@fluentui/react";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import type { ICrudWebpartProps } from "./ICrudWebpartProps";
import About from "./About";
import Home from "./Home";

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </>
  )
);

const CrudWebpart: React.FC<ICrudWebpartProps> = (props) => {
  const { context, hasTeamsContext } = props;

  const [isInitialized, setIsInitialized] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [url, setUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [items, setItems] = React.useState<any[]>([]);

  console.log("context", context);

  async function fetchItems() {
    if (hasTeamsContext) {
      const teamsSontext =
        await context.sdks.microsoftTeams?.teamsJs.app.getContext();

      console.log("teamsSontext", teamsSontext);

      let absoluteUrl = context.pageContext.web.absoluteUrl;

      if (context.pageContext.web.serverRelativeUrl === "/") {
        absoluteUrl =
          absoluteUrl +
            (context.manifest as any).experimentalData?.serverRelativeUrl ??
          "/sites/Kotecso";
      }

      const sp = spfi().using(
        SPFx({
          pageContext: {
            legacyPageContext: {
              formDigestValue:
                "0xDB596F22C7A2F7C119F5266CE3FBFA9E2DA2BF983047DF28FF14C7548928F63DA65CD29A60E1F249DB3F18AB183F9987094884B808490E4B9C8904BAED645FA8,19 Aug 2024 13:48:13 -0000",
              formDigestTimeoutSeconds: 1800,
            },
            web: {
              absoluteUrl,
            },
          },
        })
      );

      const items = await sp.web.lists.getByTitle("Crud Tasks").items();

      setItems(items);
    } else {
      const sp = spfi().using(SPFx(context));
      const items = await sp.web.lists.getByTitle("Crud Tasks").items();

      setItems(items);
    }
  }

  async function addItem() {
    const sp = spfi().using(SPFx(context));
    await sp.web.lists.getByTitle("Crud Tasks").items.add({
      Title: title,
    });

    setTitle("");
    await fetchItems();
  }

  React.useEffect(() => {
    if (!isInitialized) return;

    fetchItems()
      .then((items) => {
        console.log("Items fetched", items);
      })
      .catch((error) => {
        console.error("Error fetching items", error);
      });
  }, [isInitialized]);

  React.useEffect(() => {
    if (context.pageContext.web.serverRelativeUrl === "/") {
      const siteName = localStorage.getItem("siteName");

      if (siteName) {
        window.location.href = `/sites/${siteName}${window.location.pathname}?${window.location.search}`;
      }
    }

    setIsInitialized(context.pageContext.web.serverRelativeUrl !== "/");
    setLoading(false);
  }, [items]);

  return (
    <div>
      {loading && <div>Loading...</div>}

      <a href={url}>Click link</a>
      <br />
      <input
        style={{
          width: "300px",
          padding: "10px",
        }}
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={() => localStorage.setItem("siteName", url)}>
        Save sitename
      </button>

      {isInitialized && (
        <div className="d-flex">
          <div className="w-100">
            <DetailsList
              items={items}
              columns={[
                {
                  key: "column1",
                  name: "Title",
                  fieldName: "Title",
                  minWidth: 100,
                  maxWidth: 200,
                  isResizable: true,
                },
                {
                  key: "column2",
                  name: "Status",
                  fieldName: "Status",
                  minWidth: 100,
                  maxWidth: 200,
                  isResizable: true,
                },
              ]}
            />
          </div>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={addItem}>Add</button>
          </div>
        </div>
      )}

      <div>
        <RouterProvider router={router} />
      </div>
    </div>
  );
};

export default CrudWebpart;
