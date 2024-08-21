import * as React from "react";
import { DetailsList } from "@fluentui/react";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import type { ICrudWebpartProps } from "./ICrudWebpartProps";

const CrudWebpart: React.FC<ICrudWebpartProps> = (props) => {
  const { context, hasTeamsContext } = props;

  const [title, setTitle] = React.useState("");
  const [items, setItems] = React.useState<any[]>([]);

  console.log("context", context);

  async function fetchItems() {
    if (hasTeamsContext) {
      const teamsSontext =
        await context.sdks.microsoftTeams?.teamsJs.app.getContext();

      console.log("teamsSontext", teamsSontext);

      let absoluteUrl = context.pageContext.web.absoluteUrl;

      if (!teamsSontext?.sharePointSite?.teamSitePath) {
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
    fetchItems()
      .then((items) => {
        console.log("Items fetched", items);
      })
      .catch((error) => {
        console.error("Error fetching items", error);
      });
  }, []);

  return (
    <div>
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
    </div>
  );
};

export default CrudWebpart;
