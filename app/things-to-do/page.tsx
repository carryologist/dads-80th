export default function ThingsToDo() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Things to Do</h1>
      <p className="text-sm text-black/70 dark:text-white/70">
        Fairhaven, Mattapoisett, and nearby New Bedford have great coastal trails, beaches, and family spots.
      </p>

      <section className="grid gap-2">
        <h2 className="text-xl font-medium">Outdoors</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            Fort Phoenix State Reservation (beach + historic fort, dawn–10pm):
            {" "}
            <a className="underline" href="https://www.mass.gov/locations/fort-phoenix-state-reservation" target="_blank" rel="noreferrer">Mass.gov</a>
          </li>
          <li>
            Phoenix Bike Trail (paved, connects toward Mattapoisett Rail Trail):
            {" "}
            <a className="underline" href="https://www.savebuzzardsbay.org/places-to-go/phoenix-bike-trail/" target="_blank" rel="noreferrer">Buzzards Bay Coalition</a>
          </li>
          <li>
            Mattapoisett Rail Trail → Ned’s Point Lighthouse views:
            {" "}
            <a className="underline" href="https://mattapoisettrailtrail.com/" target="_blank" rel="noreferrer">Friends of the Mattapoisett Rail Trail</a>
          </li>
          <li>
            Nasketucket Bay State Reservation (wooded trails to rocky shoreline):
            {" "}
            <a className="underline" href="https://www.mass.gov/locations/nasketucket-bay-state-reservation" target="_blank" rel="noreferrer">Mass.gov</a>
          </li>
          <li>
            West Island Town Beach (lifeguarded in summer; passes for parking):
            {" "}
            <a className="underline" href="https://fairhaventours.com/west-island-town-beach-fairhaven-ma/" target="_blank" rel="noreferrer">Fairhaven Tourism</a>
          </li>
          <li>
            Horseneck Beach State Reservation (big Atlantic beach + birding):
            {" "}
            <a className="underline" href="https://www.mass.gov/locations/horseneck-beach-state-reservation" target="_blank" rel="noreferrer">Mass.gov</a>
          </li>
          <li>
            Lloyd Center for the Environment (trails + observation deck):
            {" "}
            <a className="underline" href="https://lloydcenter.org/walking-trails/" target="_blank" rel="noreferrer">Lloyd Center</a>
          </li>
        </ul>
      </section>

      <section className="grid gap-2">
        <h2 className="text-xl font-medium">Museums & History</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            New Bedford Whaling Museum (art, history, science + 3D theater):
            {" "}
            <a className="underline" href="https://www.whalingmuseum.org/visit/" target="_blank" rel="noreferrer">Visit page</a>
          </li>
          <li>
            New Bedford Whaling National Historical Park (downtown walking tours):
            {" "}
            <a className="underline" href="https://www.nps.gov/nebe/index.htm" target="_blank" rel="noreferrer">NPS</a>
          </li>
        </ul>
      </section>

      <section className="grid gap-2">
        <h2 className="text-xl font-medium">Kid-friendly</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            Buttonwood Park Zoo (AZA-accredited; 9am–4pm daily):
            {" "}
            <a className="underline" href="https://www.bpzoo.org/visit-overview/" target="_blank" rel="noreferrer">Plan your visit</a>
          </li>
        </ul>
      </section>

      <section className="grid gap-2">
        <h2 className="text-xl font-medium">Day trips by ferry</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            Martha’s Vineyard (Seastreak from New Bedford, seasonal):
            {" "}
            <a className="underline" href="https://seastreak.com/ferry-routes-and-schedules/between-new-bedford-marthas-vineyard-ma/" target="_blank" rel="noreferrer">Schedules</a>
          </li>
          <li>
            Cuttyhunk Island (Cuttyhunk Ferry from New Bedford):
            {" "}
            <a className="underline" href="https://cuttyhunkferryco.com/schedule/" target="_blank" rel="noreferrer">Schedule</a>
          </li>
        </ul>
      </section>

      <section className="grid gap-2">
        <h2 className="text-xl font-medium">Food & Drink</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            Oxford Creamery (Mattapoisett; classic seafood + ice cream):
            {" "}
            <a className="underline" href="https://oxfordcreamery.com/" target="_blank" rel="noreferrer">Website</a>
          </li>
          <li>
            Turk’s Seafood (Mattapoisett; market, restaurant, sushi):
            {" "}
            <a className="underline" href="https://www.turksseafood.com/" target="_blank" rel="noreferrer">Website</a>
          </li>
          <li>
            The Black Whale (New Bedford waterfront):
            {" "}
            <a className="underline" href="https://www.theblackwhale.com/" target="_blank" rel="noreferrer">Website</a>
          </li>
        </ul>
      </section>
    </div>
  );
}