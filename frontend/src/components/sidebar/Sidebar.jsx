import Conversations from "./Conversations";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  return (
    <div
      className={`border border-gray-50 dark:border-gray-700 flex flex-col md:w-1/3 p-6 widescreen:section-min-height tallscreen:section-min-height`}
    >
      <SearchInput />
      <Conversations />
    </div>
  );
};
export default Sidebar;
