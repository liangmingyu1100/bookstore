import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Swipe, SwipeItem, Badge, Lazyload, Sidebar, SidebarItem,
  Collapse, CollapseItem, Tab, Tabs, Card, Search, Image as VanImage,
  ImagePreview, Tag, Button, Icon, ActionBar, ActionBarIcon, ActionBarButton,
  Skeleton, Form, Field, Checkbox, CheckboxGroup, SwipeCell, Stepper, Cell, CellGroup,
  SubmitBar, Empty, AddressList, AddressEdit, ContactCard, Popup, List, PullRefresh,Grid, GridItem
} from 'vant';
createApp(App).use(Swipe).use(SwipeItem).use(Lazyload, {
  loading: require('assets/image/loading.gif')
})
  .use(Badge).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem)
  .use(Tab).use(Tabs).use(Card).use(Search).use(VanImage).use(ImagePreview)
  .use(Tag).use(Button).use(Icon).use(ActionBar).use(ActionBarIcon).use(ActionBarButton)
  .use(Skeleton).use(Form).use(Field).use(Checkbox).use(CheckboxGroup).use(SwipeCell)
  .use(Stepper).use(SubmitBar).use(Empty).use(Cell).use(CellGroup).use(AddressList).use(AddressEdit)
  .use(ContactCard).use(Popup).use(List).use(PullRefresh).use(Grid).use(GridItem)
  .use(store).use(router).mount('#app')
