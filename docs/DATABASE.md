# 数据库设计

## projects 表:
project_id: 项目的唯一标识符。
project_name: 项目名称。

## project_profiles 关联表:
project_id: 外键，引用 projects 表。
profile_id: 外键，引用 profiles 表。

## profiles 表:
profile_id: 用户的唯一标识符。
profile_name: 用户名称。

## tooltips 表:
tooltip_id: 工具提示的唯一标识符。
x, y: 工具提示的坐标位置。
project_id: 外键，引用 projects 表。

## comments 表:
comment_id: 评论的唯一标识符。
comment_content: 评论内容。
comment_resolved: 布尔值，表示评论是否已解决，默认为 false。
tooltip_id: 外键，引用 tooltips 表。
profile_id: 外键，引用 profiles 表。