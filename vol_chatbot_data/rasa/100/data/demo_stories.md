## story_base
* 00_greet
   - utter_greet

## story_sales_order
* 01_01_how_to{"howto": "salesorder"}
   - utter_sales_order
   - utter_anything_else

## story_ship_confirm
* 01_01_how_to{"howto": "shipconfirm"}
   - utter_how_to_ship_confirm
   - utter_anything_else

## story_wip_job
* 01_01_how_to{"howto": "wipjob"}
   - utter_how_to_wip_job
   - utter_anything_else

## story_sub_xfer 
* 01_01_how_to{"howto": "subxfer"}
   - utter_how_to_sub_xfer
   - utter_anything_else

## story issue sales order
* 01_unable_SO{"problem": "sales order"}
   - utter_ask_error 
* 01_error_msg{"actual_problem": "invalid item"}
   - utter_so_invalid_item
* 00_thanks
   - utter_anything_else

## story issue sales order direct
* 01_unable_SO{"problem": "sales order" , "actual_problem": "invalid item"}
   - utter_so_invalid_item
* 00_thanks
   - utter_anything_else

## Story issue ship_confirm
* 01_unable_wsh{"problem": "ship confirm"}
   - utter_ask_error
* 01_error_msg{"actual_problem": "container item"}
   - utter_wsh_container_item
* 00_thanks
   - utter_anything_else

## Story issue ship_confirm direct
* 01_unable_wsh{"problem": "ship confirm" , "actual_problem": "container item"}
   - utter_wsh_container_item
* 00_thanks
   - utter_anything_else

## Story issue with invocie part 1 
* 01_unable_invoice{"problem": "invoice"}
   - utter_invoice_org_items
* 00_affirm
   - utter_invoice_val_items
* 00_affirm
   - utter_invoice_enabled
* 00_affirm
   - utter_contact_support
* 00_thanks
   - utter_anything_else


## Story issue with invocie part 2 
* 01_unable_invoice{"problem": "invoice"}
   - utter_invoice_org_items
* 00_negative
   - utter_invoice_correct
   - utter_anything_else

## Story issue with invocie part 3
* 01_unable_invoice{"problem": "invoice"}
   - utter_invoice_org_items
* 00_affirm
   - utter_invoice_val_items
* 00_negative
   - utter_invoice_correct
   - utter_anything_else


## Story issue with invocie part 4
* 01_unable_invoice{"problem": "invoice"}
   - utter_invoice_org_items
* 00_affirm
   - utter_invoice_val_items
* 00_affirm
   - utter_invoice_enabled
* 00_negative
   - utter_invoice_correct
   - utter_anything_else

## Story to say thanks 
* 00_thanks
   - utter_welcome

