/* theme-tumblr.js */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      André Fiedler <fiedler dot andre a t gmail dot com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define("ace/theme/tumblr",function(require, exports, module) {

    // var dom = require("pilot/dom");

    var cssText = ".ace-tumblr .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
\
.ace-tumblr .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-tumblr .ace_gutter {\
  width: 50px;\
  background: rgba(0,0,0,.1);\
  color: #666;\
  overflow : hidden;\
}\
\
.ace-tumblr .ace_gutter-layer {\
  width: 100%;\
  text-align: right;\
}\
\
.ace-tumblr .ace_gutter-layer .ace_gutter-cell {\
  padding-right: 6px;\
}\
\
.ace-tumblr .ace_text-layer {\
  cursor: text;\
  color: #f2f2f2;\
}\
\
.ace-tumblr .ace_cursor {\
  border-left: 2px solid #A7A7A7;\
}\
\
.ace-tumblr .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid #A7A7A7;\
}\
 \
.ace-tumblr .ace_marker-layer .ace_selection {\
  background: rgba(221, 240, 255, 0.20);\
}\
\
.ace-tumblr .ace_marker-layer .ace_step {\
  background: rgb(198, 219, 174);\
}\
\
.ace-tumblr .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid rgba(255, 255, 255, 0.25);\
}\
\
.ace-tumblr .ace_marker-layer .ace_active_line {\
  background: rgba(255, 255, 255, 0.031);\
}\
\
       \
.ace-tumblr .ace_invisible {\
  color: rgba(255, 255, 255, 0.25);\
}\
\
.ace-tumblr .ace_keyword {\
  color:#93CCFF;\
}\
\
.ace-tumblr .ace_keyword.ace_operator {\
  color:#C0ECFF;\
}\
\
.ace-tumblr .ace_constant {\
  color:red;\
}\
\
.ace-tumblr .ace_constant.ace_language {\
  \
}\
\
.ace-tumblr .ace_constant.ace_library {\
  \
}\
\
.ace-tumblr .ace_constant.ace_numeric {\
  color: #E2FF19;\
}\
\
.ace-tumblr .ace_invalid {\
  \
}\
\
.ace-tumblr .ace_invalid.ace_illegal {\
  color:#F8F8F8;\
background-color:rgba(86, 45, 86, 0.75);\
}\
\
.ace-tumblr .ace_invalid.ace_deprecated {\
  text-decoration:underline;\
font-style:italic;\
color:#D2A8A1;\
}\
\
.ace-tumblr .ace_support {\
  color:#93CCFF;\
}\
\
.ace-tumblr .ace_support.ace_function {\
  color:#aeb2f8;\
}\
\
.ace-tumblr .ace_function.ace_buildin {\
  \
}\
\
.ace-tumblr .ace_string {\
  color:#51E608;\
}\
\
.ace-tumblr .ace_string.ace_regexp {\
  color:#E9C062;\
}\
\
.ace-tumblr .ace_comment {\
  color:#888;\
}\
\
.ace-tumblr .ace_comment.ace_doc {\
  color:#A6C6FF;\
}\
\
.ace-tumblr .ace_comment.ace_doc.ace_tag {\
  color:#A6C6FF;\
}\
\
.ace-tumblr .ace_variable {\
  color:#bebf55;\
}\
\
.ace-tumblr .ace_variable.ace_language {\
  color:#E2FF19;\
}\
\
.ace-tumblr .ace_xml_pe {\
  color:#494949;\
}";

    // import CSS once
    // dom.importCssString(cssText);
    
    exports.cssText = cssText;
    exports.cssClass = "ace-tumblr";
});
